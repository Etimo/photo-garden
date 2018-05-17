const config = require("config");
const logger = require("logging");
const url = require("url");
const dbClient = require("db").create("garden");
const users = require("provider-user");
const https = require("https");
const filesWorker = require('../workers/dropbox.worker');
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
      encodeURIComponent("http://localhost:3000/dropbox/auth/finish") +
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
    return unauthorized();
  }
  const access_token = req.query.access_token;
  const account_id = req.query.account_id;
  const uid = req.query.uid;

  let userFetched = await getUserIdentity(account_id, req, access_token).catch(
    () => (userFetched = false)
  );

  if (!userFetched) {
    return unauthorized();
  }

  // Create cookie
  logger.info("Tokens", access_token);

  // Start async work
  //providerTokens.updateTokens(req.gardenSession.userIdentity, access_token);
  // filesWorker.getFilesInDrive(
  //   client,
  //   req.gardenSession.userIdentity
  // );
    filesWorker.fetchPhotos(access_token, req.gardenSession.userIdentity, 0);

  res.send(
    "Successfully authorized. Your files will be fetched on the server, check output"
  );
};

function isVerified(req) {
  return req.query.access_token && req.query.account_id && req.query.uid;
}

function unauthorized(res) {
  res.status = 401;
  logger.warn("Unauthorized");
  res.send("Logged off");
}

async function getUserIdentity(userIdentifier, req, access_token) {
  logger.info("Get user id");
  let userId;
  try {
    userId = await users.getByIdentity("Dropbox", userIdentifier);
    logger.info("Found user id", userId);
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
async function getUserMail(token, account_id) {
  return new Promise((resolve, reject) => {
    console.log(new Date(), "TOKEN: ", token, " ACCOUNT ID: ", account_id);
    const obj = {
      account_id: account_id
    };
    var options = {
      url: "api.dropboxapi.com/2/users/get_account",
      json: true,
      port: 3000,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        Authorization: "Bearer " + token
      }
    };
    var req = https.request(options, function(res) {
      console.log(" RESPONSE Status: " + res.statusCode);
      console.log("RESPONSE Headers: " + JSON.stringify(res.headers));
      res.setEncoding("utf8");
      res.on("data", body => {
        console.log("Body: " + body);

        const respobj = JSON.parse(body);

        // TODO: Discuss if we should allow to connect if the email is not verified
        if (respobj.email_verified) {
          resolve(respobj.email);
        }
      });
    });
    req.on("error", e => {
      console.log("HTTP ERROR: " + e.message);
      reject();
    });
    // write data to request body
    req.write(JSON.stringify(obj));
    req.end();
  });
}
