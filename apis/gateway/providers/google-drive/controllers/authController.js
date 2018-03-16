"use strict";
const scopes = ["https://www.googleapis.com/auth/drive.readonly", "email"];
const util = require("../lib/util");
const filesWorker = require("../workers/files");
const config = require("../../config");

function getAuthUrl() {
  const client = util.getClient();
  return client.generateAuthUrl({
    "access_type": "offline",
    "scope": scopes,
    "redirect_uri": config.GOOGLE_CLIENT_REDIRECT_URI
  });
}

function finishAuth(client, req, res) {
  const code = req.query.code;
  if (!code) {
    // Error, what to do?
    res.redirect("/error");
  }
  client.getToken(code, (err, tokens) => {
    if (err) {
      // Error, what to do?
      res.redirect("/error");
    } else {
      // Verify id token
      console.log("CLIENTELE: ", client);
      const key = tokens.id_token;//req.body.idToken;
      client.verifyIdToken(
        key,
        client._clientId,
        (e, login) => {
          console.log("Parametrize me baby: ", e, login);
          const payload = login.getPayload();
          res.status = getUserIdentity(payload.verified, payload.email, req, res) ? 200 : 401;
          if (res.status === 401) {
            res.send("Fuckoff");
          } else {
            // Create cookie
            console.log(tokens);
            // Start async work
            client.credentials = tokens;
            filesWorker.getFilesInDrive(client);
            res.send(
              "Successfully authorized. Your files will be fetched on the server, check output"
            );
          }
        });
    }
  });
}

const getUserIdentity = (verified, userIdentifier, req) => {
  //DO A LOOKUP FOR USER IDENTITY USING USERIDENTIFIER AS A KEY!
  //Todo: Look at actual fields.
  const userIdentity = {
    guid: "1111111"
  };
  if (userIdentity) {
    req.gardenSession.userIdentity = userIdentity.guid;
    return true;
  }
  return false;


};

exports.authStart = (req, res) => {
  console.log(req, res);
  res.redirect(getAuthUrl());
};

exports.authFinish = (req, res) => {
  finishAuth(util.getClient(), req, res);
};
