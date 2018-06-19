const config = require("config");
const api = require("../client").api;
const logger = require("logging");
const providerUser = require("provider-user");

const redirectUri = config.get("providers.instagram.clientRedirectUri");

module.exports.authStart = (req, res) => {
  res.redirect(api.get_authorization_url(redirectUri));
};

module.exports.authFinish = async (req, res) => {
  api.authorize_user(req.query.code, redirectUri, async (err, result) => {
    if (err) {
      console.log(err.body);
      res.status(403).send("Didn't work");
    } else {
      // Setup user
      console.log("Yay! Access token is ", result);
      try {
        userId = await providerUser.getByIdentity("Instagram", result.user.id);
      } catch (err) {
        logger.error(`Failed to find user identity: ${err}`);
        return false;
      }
      api.use({ access_token: result.access_token });
      api.user_media_recent(result.user.id, function(
        err,
        medias,
        pagination,
        remaining,
        limit
      ) {
        console.log(err);
        console.log(medias);
        console.log(pagination);
        console.log(remaining);
        console.log(limit);
      });
      res.send("OK");
    }
  });
};
