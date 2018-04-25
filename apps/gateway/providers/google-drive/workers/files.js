const logger = require("logging");
const communication = require("communication");
const providerTokens = require("provider-google-drive-tokens");
const google = require("googleapis");
const GoogleAuth = require("google-auth-library");
const auth = new GoogleAuth();
const util = require("../lib/util");

function filesListCallback(client, err, response, user) {
  logger.info("Get files from drive using v3", err);
  if (err) {
    logger.error(`The API returned an error: ${err}`);
    return;
  }

  // TODO: save nextPageToken so we dont have to start all over on next login
  providerTokens.updateNextPageToken(user, response.nextPageToken);

  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, user, response.nextPageToken);
  }
  response.files
    .filter(util.isValidFile)
    .splice(0, 1)
    .forEach(file => publishToQueue(file, user));
}

function publishToQueue(item, user) {
  const normalized = util.normalizePhotoInfo(item, user);
  communication.publish("user-photo--google-drive--received", {
    user: user,
    photo: item
  });
}

function getFilesInDrive(client, user, nextPageToken) {
  const options = {
    auth: client,
    fields: "nextPageToken, files"
  };
  if (nextPageToken) {
    // Indicate that we want to continue a previously started search
    options.pageToken = nextPageToken;
  } else {
    // Get from db
    options.pageToken = providerTokens.getNextPageToken(user);
  }
  const service = google.drive("v3");
  service.files.list(options, (err, response) => {
    filesListCallback(client, err, response, user);
  });
}

module.exports = {
  getFilesInDrive
};
