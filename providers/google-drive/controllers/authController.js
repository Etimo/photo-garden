var scopes = ["https://www.googleapis.com/auth/drive.readonly"];
var util = require("../lib/util");
var filesWorker = require("../workers/files");
var config = require("../../config");

function getAuthUrl() {
  var client = util.getClient();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    redirect_uri: config.GOOGLE_CLIENT_REDIRECT_URI
  });
}

function finishAuth(client, code, res) {
  if (!code) {
    // Error, what to do?
    res.redirect("/error");
  }
  client.getToken(code, (err, tokens) => {
    if (err) {
      // Error, what to do?
      res.redirect("/error");
    } else {
      client.credentials = tokens;
      filesWorker.getFilesInDrive(client);
      res.send("Successfully authorized. Your files will be fetched on the server, check output")
    }
  });
}

exports.authStart = (req, res) => {
  res.redirect(getAuthUrl());
};

exports.authFinish = (req, res) => {
  finishAuth(util.getClient(), req.query.code, res);
};
