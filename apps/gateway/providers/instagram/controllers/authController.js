const config = require("config")
const client = require("../client")

function finishAuth() {

}

module.exports.authStart = (req, res) => {
  const clientId = config.get("providers.instagram.clientId")
  const redirectUri = config.get("providers.instagram.clientRedirectUri")
  const link = `https://api.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  res.redirect(link);
};

module.exports.authFinish = async (req, res) => {
  const code = await client.getAccessToken(req.query.code)
};

