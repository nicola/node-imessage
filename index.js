'use strict';

var path = require('path');

var HOME = getUserHome();

function getUserHome() {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

module.exports = iMessage;

function iMessage(opts) {
  opts = opts || {};
  this.knex = require('knex')({
    client: 'sqlite',
    connection: {
      filename: opts.path || iMessage.DB_PATH,
      mode: require('sqlite3').OPEN_READONLY
    }
  });
}

iMessage.OSX_EPOCH = 978307200;
iMessage.DB_PATH = path.join(HOME, '/Library/Messages/chat.db');

iMessage.prototype.getRecipients = function(string, cb) {
  if (typeof string === 'function') {
    cb = string;
    string = false;
  }
  var query = this.knex
    .select()
    .from('handle');
  if (string) query.where('id', 'like', '%' + string + '%');
  return query.nodeify(cb);
};

iMessage.prototype.getRecipientById = function(id, details, cb) {
  if (typeof details == 'function') {
    cb = details;
    details = false;
  }
  return this.knex
    .first()
    .from('handle')
    .where('ROWID', id)
    .bind(this)
    .tap(function (recipient) {
      if (details) {
        return this.knex
          .select()
          .from('message')
          .where('handle_id', id)
          .then(function (messages) {
            recipient.messages = messages;
          });
      }
    })
    .nodeify(cb);
};

iMessage.prototype.getMessages = function(string, details, cb) {
  if (typeof string == 'function') {
    cb = string;
    string = false;
  }
  if (typeof details == 'function') {
    cb = details;
    details = false;
  }
  var query = this.knex
    .select()
    .from('message');

  if (string) query.where('message.text', 'like', '%' + string + '%');
  if (details) query.join('handle', 'handle.rowID', 'message.handle_id');
  
  return query.nodeify(cb);
};

iMessage.prototype.getMessagesFromId = function(id, string, cb) {
  if (typeof string == 'function') {
    cb = string;
    string = false;
  }
  var query = this.knex
    .select()
    .from('message')
    .where('handle_id', id);

  if (string) query.where('text', 'like', '%' + string + '%');
  
  return query.nodeify(cb);
};

iMessage.prototype.getAttachmentsFromId = function(id, cb) {
  return this.knex
    .select()
    .from('message')
    .innerJoin('message_attachment_join', 'message.ROWID', 'message_attachment_join.message_id')
    .innerJoin('attachment', 'attachment.ROWID', 'message_attachment_join.attachment_id')
    .where('message.handle_id', id)
    .nodeify(cb);
};

iMessage.prototype.getAttachments = function(cb) {
  return this.knex
    .select()
    .from('message_attachment_join')
    .innerJoin('message', 'message.ROWID', 'message_attachment_join.message_id')
    .innerJoin('attachment', 'attachment.ROWID', 'message_attachment_join.attachment_id')
    .nodeify(cb);
};

iMessage.prototype.raw = function (sql, bindings, cb) {
  if (typeof bindings === 'function') {
    bindings = void 0;
    cb = bindings;
  }
  return this.knex.raw(sql, bindings).nodeify(cb);
};

iMessage.prototype.disconnect = function() {
  return this.knex.destroy();
};
