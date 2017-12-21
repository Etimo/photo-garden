var google = require('googleapis');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var util = require("../lib/util");

function filesListCallback(client, err, response) {
  if (err) {
    console.log('The API returned an error: ' + err);
    return;
  }
  if (response.hasOwnProperty("nextPageToken")) {
    // We have not reached the end yet, continue listing
    getFilesInDrive(client, response.nextPageToken);
  }
  var files = response.files;
  console.log(files.filter(util.isValidFile));
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

module.exports.getFilesInDrive = getFilesInDrive;
