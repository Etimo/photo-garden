const config = require("config");
const logger = require("logging");
const providerUser = require("provider-user");
const communication = require("communication");
const instagram = require("instagram-node");

const redirectUri = config.get("providers.instagram.clientRedirectUri");

function getClient() {
  const api = instagram.instagram();
  api.use({
    client_id: config.get("providers.instagram.clientId"),
    client_secret: config.get("providers.instagram.clientSecret")
  });
  return api;
}

function onResult(err, medias, pagination, remaining, limit) {
  medias.forEach(media =>
    communication.publish("user-photo--instagram--received", {
      user: userId,
      photo: media
    })
  );

  // Queue next page
  console.log(medias.length, pagination, remaining, limit);
  if (pagination && pagination.next) {
    pagination.next(onResult);
  }
}

module.exports.authStart = (req, res) => {
  res.redirect(getClient().get_authorization_url(redirectUri));
};

module.exports.authFinish = async (req, res) => {
  const api = getClient();
  api.authorize_user(req.query.code, redirectUri, async (err, result) => {
    if (err) {
      console.log(err.body);
      res.status(403).send("Didn't work");
    } else {
      // Setup user
      console.log("Yay! Access token is ", result);
      try {
        userId = await providerUser.getByIdentity("Instagram", result.user.id, req.gardenSession.userIdentity);
        req.gardenSession.userIdentity = userId;
      } catch (err) {
        logger.error(`Failed to find user identity: ${err}`);
        return false;
      }
      api.use({ access_token: result.access_token });
      api.user_media_recent(result.user.id, onResult);
      res.redirect("http://localhost:3001");
    }
  });
};
