var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var Q = require('q');

var HOME = getUserHome();

var identities = [];

function getUserHome() {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}

module.exports = iMessage;

function iMessage(opts) {
  opts = opts || {};
  this.path = opts.path || this.DB_PATH;
  this.db = this.connect();
}

iMessage.prototype.OSX_EPOCH = 978307200;
iMessage.prototype.DB_PATH = path.join(HOME, '/Library/Messages/chat.db');

iMessage.prototype.connect = function() {
  var deferred = Q.defer();

  var db = new sqlite3.Database(
    this.path,
    sqlite3.OPEN_READONLY,
    function(err, res) {
      if (err) return deferred.reject(err);
      return deferred.resolve(db);
    });

  return deferred.promise;
};

iMessage.prototype.getDb = function(cb) {
  var args = arguments;

  // nodeify?
  this.db
    .then(function(db) {
      cb(null, db);
    }, function(err) {
      cb(err);
    });
};


iMessage.prototype.disconnect = function() {
  this.db.done(function(db) {
    db.close();
  });
};
