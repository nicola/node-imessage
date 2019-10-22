var iMessage = require('../index.js');

var im = new iMessage();
im.getDb(function(err, db) {
  db.all("SELECT * FROM message", function(err, res) {
    console.log(err, res);
  });
});
im.disconnect();
