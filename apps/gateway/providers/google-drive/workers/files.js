const logger = require("logging");
const communication = require("communication");
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
  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, user, response.nextPageToken);
  }
  const files = response.files;
  files.filter(util.isValidFile).forEach(file => publishToQueue(file, user));
}

function publishToQueue(item, user) {
  const normalized = util.normalizePhotoInfo(item, user);
  // Queue data to db
  communication.queue.publish("new-photo-store-metadata", normalized);
  communication.queue.publish("new-photo-download-google-drive", item);
}

function getFilesInDrive(client, user, nextPageToken) {
  const options = {
    auth: client,
    fields: "nextPageToken, files"
  };
  if (nextPageToken) {
    // Indicate that we want to continue a previously started search
    options.pageToken = nextPageToken;
  }
  const service = google.drive("v3");
  service.files.list(options, (err, response) => {
    filesListCallback(client, err, response, user);
  });
}

module.exports = {
  getFilesInDrive
};
