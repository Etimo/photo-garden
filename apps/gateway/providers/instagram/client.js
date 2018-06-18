const axios = require("axios")
const config = require("config")

async function getAccessToken(code) {
  const data = {
      client_id: config.get("providers.instagram.clientId"),
      client_secret: config.get("providers.instagram.clientSecret"),
      redirect_uri: config.get("providers.instagram.clientRedirectUri"),
      grant_type: 'authorization_code',
      code,
  }
  console.log(data)
  const res = await axios.get('https://api.instagram.com/oauth/access_token', data)
  console.log(res.data)
  return res
}

module.exports = {
  getAccessToken,
}
