var iMessage = require('../index.js');
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
  .callback(function(opts) {
    im.getMessages(opts[1], true, function(err, messages) {
      if (err) return console.log("Error in retrieveing messages", err);
      if (opts.count) return console.log(messages.length);
      var handles = {};
      if (opts.json) return console.log(messages);
      messages.forEach(function(m) {
        console.log(m.id);
        console.log(m.text, '\n');
      });
    });
  })
  .help("Search messages with particular");

parser.parse();