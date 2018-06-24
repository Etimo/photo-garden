const logger = require("logging");
const users = require("provider-user");
const providerTokens = require("provider-google-drive-tokens");
const dbClient = require("db").create("garden");

const util = require("../lib/util");
const filesWorker = require("../workers/files");

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
      logger.info("CLIENTELE: " + client);
      const key = tokens.id_token; //req.body.idToken;
      client.verifyIdToken(key, client._clientId, (e, login) => {
        logger.info("Parametrize me baby: ", e, login);
        const payload = login.getPayload();
        logger.info(payload);
        getUserIdentity(payload.email_verified, payload.email, req, res).then(
          success => {
            res.status = success ? 200 : 401;
            if (res.status === 401) {
              logger.warn("Not authorized");
              res.send("Sod off2");
            } else {
              // Create cookie
              logger.info("Tokens", tokens);
              // Start async work
              client.credentials = tokens;
              providerTokens.updateTokens(
                req.gardenSession.userIdentity,
                tokens
              );
              filesWorker.getFilesInDrive(
                client,
                req.gardenSession.userIdentity
              );
              res.redirect("http://localhost:3001");
              // res.send(
              //   "Successfully authorized. Your files will be fetched on the server, check output"
              // );
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
    userId = await users.getByIdentity("Google", userIdentifier, req.gardenSession.userIdentity);
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
  res.redirect(util.getAuthUrl());
};

exports.authFinish = (req, res) => {
  finishAuth(util.getClient(), req, res);
};
