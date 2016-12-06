#!/usr/bin/env node

'use strict';

var iMessage = require('../index.js');
var moment   = require('moment');
var Promise  = require('bluebird');
var im       = new iMessage();

var parser = require('nomnom');

parser.command('search')
  .option('count', {
    help: 'Just return the count',
    flag: true
  })
  .option('json', {
    help: 'Print in json format',
    flag: true
  })
  .option('recipient', {
    help: 'Specify recepient',
  })
  .callback(function(opts) {
    Promise.try(function () {
      if (opts.recipient) {
        return im.getMessagesFromId(opts.recipient, opts[1])
          .then(function (messages) {
            if (opts.count) return console.log(messages.length);
            if (opts.json) return console.log(messages);

            messages.forEach(function (message) {
              if (message.is_from_me) {
                console.log('Me to', opts.recipient);
              }
              else {
                console.log(opts.recipient + ' to me');
              }
              console.log(message.text);
              console.log('Sent:', moment((message.date + iMessage.OSX_EPOCH)*1000).fromNow());
              console.log('---');
            });
          });
      }
      else {
        return im.getMessages(opts[1], true)
          .then(function (messages) {
            if (opts.count) return console.log(messages.length);
            if (opts.json) return console.log(messages);

            messages.forEach(function(message) {
              if (message.is_from_me) {
                console.log('Me to', message.id, '('+message.handle_id+')');
              } else {
                console.log(message.id, '('+message.handle_id+')' + ' to me');
              }
              console.log(message.text);
              console.log('Sent:', moment((message.date + iMessage.OSX_EPOCH)*1000).fromNow());
              console.log('---');
            });
          });
      }
    })
    .catch(function (err) {
      console.log('Error retrieveing messages', err);
    })
    .finally(function () {
      return im.disconnect();
    });
  })
  .help('Search messages with particular');

parser.command('recipients')
  .option('json', {
    help: 'Print in json format',
    flag: true
  })
  .option('count', {
    help: 'Just return the count',
    flag: true
  })
  .callback(function(opts) {
    im.getRecipients(opts[1])
      .then(function (recipients) {
        if (opts.count) return console.log(recipients.length);
        if (opts.json) return console.log(recipients);

        recipients.forEach(function(m) {
          console.log('name:', m.id);
          console.log('id:', m.ROWID);
          console.log('---');
        });
      })
      .catch(function (err) {
        console.log('Error retrieveing messages', err);
      })
      .finally(function () {
        return im.disconnect();
      });
  })
  .help('Search messages with particular');

parser.parse();
