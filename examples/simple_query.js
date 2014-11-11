var iMessage = require('../index.js');

var im = new iMessage();
im.getDb(function(err, db) {
  db.all("SELECT * FROM message_attachment_join", function(err, res) {
    console.log(err, res);
  });
});
im.disconnect();
