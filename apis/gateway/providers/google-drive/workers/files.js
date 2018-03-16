var google = require("googleapis");
var GoogleAuth = require("google-auth-library");
var auth = new GoogleAuth();
var util = require("../lib/util");
var queue = require("../lib/queue");

function normalizePhotoInfo(fileInfo) {
  return {
    // FIXME: Replace with user id from login-api
    owner: 'd88774ad-91de-413a-bb3d-270e82bf2176',
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo
  };
}

function filesListCallback(client, err, response) {
  if (err) {
    console.log("The API returned an error: " + err);
    return;
  }
  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, response.nextPageToken);
  }
  var files = response.files;
  files
    .filter(util.isValidFile)
    .map(normalizePhotoInfo)
    .forEach(queue.publish);

}

function getFilesInDrive(client, nextPageToken) {
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
    filesListCallback(client, err, response);
  });
}

module.exports = {
  getFilesInDrive
};
