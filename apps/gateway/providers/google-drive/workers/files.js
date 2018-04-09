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
  files
    .filter(util.isValidFile)
    .map(file => util.normalizePhotoInfo(file, user))
    .forEach(publishToQueue);
}

function publishToQueue(item) {
  // Queue data to db
  communication.queue.publish("new-photo", item);

  // Queue download of thumbnail
  communication.queue.publish("new-photo-url", {
    id: item.id,
    url: item.thumbnailLink,
    user: item.user
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
  }
  const service = google.drive("v3");
  service.files.list(options, (err, response) => {
    filesListCallback(client, err, response, user);
  });
}

module.exports = {
  getFilesInDrive
};
