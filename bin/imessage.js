#!/usr/bin/env node

var iMessage = require('../index.js');
var moment = require('moment');
var im = new iMessage();

var parser = require("nomnom");

parser.command('search')
  .option('count', {
    help: "Just return the count",
    flag: true
  })
  .option('json', {
    help: "Print in json format",
    flag: true
  })
  .option('recipient', {
    help: "Specify recepient",
  })
  .callback(function(opts) {
    if (opts.recipient) {
      im.getMessagesFromId(opts.recipient, opts[1], function(err, messages) {
        if (err) return console.log("Error in retrieveing messages", err);
        if (opts.count) return console.log(messages.length);
        if (opts.json) return console.log(messages);

        messages.forEach(function(m) {
          if (m.is_from_me) {
            console.log("Me to", opts.recipient);
          } else {
            console.log(opts.recipient + ' to me');
          }
          console.log(m.text);
          console.log("Sent:", moment((m.date + iMessage.OSX_EPOCH)*1000).fromNow());
          console.log('---');
        });
      });
    } else {
      im.getMessages(opts[1], true, function(err, messages) {
        if (err) return console.log("Error in retrieveing messages", err);
        if (opts.count) return console.log(messages.length);
        if (opts.json) return console.log(messages);

        messages.forEach(function(m) {
          if (m.is_from_me) {
            console.log("Me to", m.id, "("+m.handle_id+")");
          } else {
            console.log(m.id, "("+m.handle_id+")" + " to me");
          }
          console.log(m.text);
          console.log("Sent:", moment((m.date + iMessage.OSX_EPOCH)*1000).fromNow());
          console.log('---');
        });
      });
    }
  })
  .help("Search messages with particular");

parser.command('recipients')
  .option('json', {
    help: "Print in json format",
    flag: true
  })
  .option('count', {
    help: "Just return the count",
    flag: true
  })
  .callback(function(opts) {
    im.getRecipients(opts[1], function(err, recipients) {
      if (err) return console.log("Error in retrieveing recipients", err);
      if (opts.count) return console.log(recipients.length);
      if (opts.json) return console.log(recipients);
      recipients.forEach(function(m) {
        console.log("name:", m.id);
        console.log("id:", m.ROWID);
        console.log('---');
      });
    });
  })
  .help("Search messages with particular");

parser.parse();