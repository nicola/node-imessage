var path = require('path');
var OSX_EPOCH = 978307200;
var HOME = getUserHome();
var IMESSAGE_DB_PATH = path.join(HOME, '/Library/Messages/chat.db');
var identities = [];

function getUserHome() {
  var envVar = (process.platform == 'win32') ? 'USERPROFILE' : 'HOME';
  return process.env[envVar];
}


