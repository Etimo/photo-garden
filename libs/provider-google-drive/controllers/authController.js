"use strict";
const logger = require("logging").logger;
const scopes = ["https://www.googleapis.com/auth/drive.readonly", "email"];
const util = require("../lib/util");
const filesWorker = require("../workers/files");
const config = require("../../config");
const users = require("../../../users");

function getAuthUrl() {
  const client = util.getClient();
  return client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: config.GOOGLE_CLIENT_REDIRECT_URI
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
      logger.info("CLIENTELE: ", client);
      const key = tokens.id_token; //req.body.idToken;
      client.verifyIdToken(key, client._clientId, (e, login) => {
        logger.info("Parametrize me baby: ", e, login);
        const payload = login.getPayload();
        getUserIdentity(payload.email_verified, payload.email, req, res).then(
          success => {
            res.status = success ? 200 : 401;
            if (res.status === 401) {
              res.send("Sod off");
            } else {
              // Create cookie
              logger.info(tokens);
              // Start async work
              client.credentials = tokens;
              filesWorker.getFilesInDrive(
                client,
                req.gardenSession.userIdentity
              );
              res.send(
                "Successfully authorized. Your files will be fetched on the server, check output"
              );
            }
          }
        );
      });
    }
  });
}

async function getUserIdentity(verified, userIdentifier, req) {
  if (!verified) {
    return false;
  }
  let userId;
  try {
    userId = await users.getByIdentity("Google", userIdentifier);
  } catch (err) {
    logger.error(`Failed to find user identity: ${err}`);
    return false;
  }
  if (userId) {
    req.gardenSession.userIdentity = userId;
    return true;
  } else {
    return false;
  }
}

exports.authStart = (req, res) => {
  res.redirect(getAuthUrl());
};

exports.authFinish = (req, res) => {
  finishAuth(util.getClient(), req, res);
};
