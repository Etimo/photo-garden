const logger = require("logging");
const communication = require("communication");
var google = require("googleapis");
var GoogleAuth = require("google-auth-library");
var auth = new GoogleAuth();
var util = require("../lib/util");

function filesListCallback(client, err, response, user) {
  logger.info("Get files from drive using v3", err);
  if (err) {
    logger.error("The API returned an error: " + err);
    return;
  }
  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, user, response.nextPageToken);
  }
  var files = response.files;
  files
    .filter(util.isValidFile)
    .map(file => util.normalizePhotoInfo(file, user))
    .forEach(publishToQueue);
}

function publishToQueue(item) {
  communication.queue.publish("new-photo", item);
}

function getFilesInDrive(client, user, nextPageToken) {
  var options = {
    auth: client,
    fields: "nextPageToken, files"
  };
  if (nextPageToken) {
    // Indicate that we want to continue a previously started search
    options.pageToken = nextPageToken;
  }
  var service = google.drive("v3");
  service.files.list(options, (err, response) => {
    filesListCallback(client, err, response, user);
  });
}

module.exports = {
  getFilesInDrive
};
