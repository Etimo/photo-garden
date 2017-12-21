var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var config = require("../../config");

function isValidFile(file) {
  return file.mimeType === "image/jpeg";
}

function getClient() {
  return new auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_CLIENT_REDIRECT_URI
  );
}

function assertConfig(config, keys) {
  var missing = keys.reduce((prev, key) => {
    if (!config[key]) {
      console.error(`Missing config key ${key}`);
      return true;
    }
    return prev;
  }, false);
  if (missing) {
    process.exit(1);
  }
}

module.exports = {
  getClient: getClient,
  isValidFile: isValidFile,
  assertConfig: assertConfig
};
