const config = require("config")
const api = require('instagram-node').instagram();

api.use({
  client_id: config.get("providers.instagram.clientId"),
  client_secret: config.get("providers.instagram.clientSecret"),
})

module.exports = {
  api
}
