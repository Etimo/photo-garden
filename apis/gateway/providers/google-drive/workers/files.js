var google = require("googleapis");
var GoogleAuth = require("google-auth-library");
var auth = new GoogleAuth();
var util = require("../lib/util");
var queue = require("../lib/queue");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo
  };
}

function filesListCallback(client, err, response, user) {
  if (err) {
    console.log("The API returned an error: " + err);
    return;
  }
  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, user, response.nextPageToken);
  }
  var files = response.files;
  files
    .filter(util.isValidFile)
    .map(file => normalizePhotoInfo(file, user))
    .forEach(queue.publish);

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
