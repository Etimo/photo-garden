const config = require("config");
const logger = require("logging");
const url = require("url");
const dbClient = require("db").create("garden");
const users = require("provider-user");
const https = require("https");
const filesWorker = require("../workers/dropbox.worker");
const dropbox = require("dropbox-api");
const dropboxDb = require("dropbox-db");
// const filesWorker = require("../../../workers/dropbox.worker");

const clientId = config.get("providers.dropbox.clientId");
const sessionId = Math.random()
  .toString(36)
  .substring(7);

exports.start = (req, res) => {
  res.redirect(
    "https://www.dropbox.com/oauth2/authorize?response_type=token&" +
      "client_id=" +
      encodeURIComponent(clientId) +
      "&" +
      "redirect_uri=" +
      encodeURIComponent(config.get("providers.dropbox.clientRedirectUri")) +
      "&" +
      "state=" +
      sessionId
  );
};
exports.redirect = (req, res) => {
  res.sendFile("./public/html/dropbox.html", {
    root: __dirname + "../../../../"
  });
};

exports.finish = async (req, res) => {
  if (!isVerified(req)) {
    return unAuthorized(res);
  }
  const access_token = req.query.access_token;
  const dropbox_account_id = req.query.account_id;
  const uid = req.query.uid;

  let userEmail = await dropbox.getUserInfo(access_token, dropbox_account_id);
  if (!userEmail.success) {
    return unAuthorized(res);
  }

  await getUserIdentity(dropbox_account_id, req, access_token);
  if (!req.gardenSession.userIdentity) {
    return unAuthorized(res);
  }

  // Start async work
  filesWorker.fetchPhotos(access_token, req.gardenSession.userIdentity, 0);
  res.send();
};

function isVerified(req) {
  return req.query.access_token && req.query.account_id && req.query.uid;
}

function unAuthorized(res) {
  logger.warn("unAuthorized");
  res.sendStatus(401);
}

async function getUserIdentity(userIdentifier, req, access_token) {
  let userId;
  try {
    userId = await users.getByIdentity(
      "Dropbox",
      userIdentifier,
      req.gardenSession.userIdentity
    );
    req.gardenSession.userIdentity = userId;
    await dropboxDb.storeDropboxToken(
      req.gardenSession.userIdentity,
      access_token
    );
  } catch (err) {
    logger.error(`Failed to find user identity: ${err}`);
    return false;
  }
}
