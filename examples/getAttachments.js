var iMessage = require('../index.js');

var im = new iMessage();
im.getAttachmentsFromId(1, function(err, rows) {
  console.log(err, rows, rows.length);
});
im.disconnect();
