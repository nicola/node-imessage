var iMessage = require('../index.js');

var im = new iMessage();
im.getRecipients("vir", function(err, rows) {
  console.log(err, rows, rows.length);
});
im.disconnect();
