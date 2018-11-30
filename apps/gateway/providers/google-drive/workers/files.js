const logger = require("logging");
const communication = require("communication");
const providerTokens = require("provider-google-drive-tokens");
const google = require("googleapis");
const GoogleAuth = require("google-auth-library");
const auth = new GoogleAuth();
const util = require("../lib/util");
const config = require("config");

const maxPhotosPerAccount = Number(
  config.get("limits.maxPhotoCountPerAccount")
);
const downloadBatchSize = 25;

function filesListCallback(client, err, response, user, fetchedEarlierCount) {
  logger.info("Get files from drive using v3", err);
  if (err) {
    logger.error(`The API returned an error: ${err}`);
    return;
  }

  fetchedEarlierCount += downloadBatchSize;

  if (
    response.hasOwnProperty("nextPageToken") &&
    fetchedEarlierCount < maxPhotosPerAccount
  ) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, user, response.nextPageToken, fetchedEarlierCount);
  }
  response.files
    .filter(util.isValidFile)
    .forEach(file => publishToQueue(file, user));
}

function publishToQueue(item, user) {
  const normalized = util.normalizePhotoInfo(item, user);
  communication.publish("user-photo--google-drive--received", {
    user: user,
    photo: item
  });
}

function getFilesInDrive(client, user, nextPageToken, fetchedEarlierCount) {
  const options = {
    auth: client,
    fields: "nextPageToken, files",
    pageToken: nextPageToken || null,
    pageSize: downloadBatchSize,
    q: util.validFileQuery()
  };
  fetchedEarlierCount = fetchedEarlierCount || 0;
  const service = google.drive("v3");
  service.files.list(options, (err, response) => {
    filesListCallback(client, err, response, user, fetchedEarlierCount);
  });
}

module.exports = {
  getFilesInDrive
};
