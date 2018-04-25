const express = require("express");
const logger = require("logging");
const config = require("config");
const communication = require("communication");

const app = express();
const port = config.get("providers.port") | 3000;

// Mount available providers
const providers = ["google-drive"];
providers.forEach(provider => {
  logger.info(`Mounting provider ${provider}`);
  app.use(`/${provider}`, require(`./${provider}`));
});

/* istanbul ignore next */
if (!module.parent) {
  // Start
  app.listen(port);
  logger.info("Listening on port", port);
}

communication.connect({
  clientId: "gateway"
});

module.exports = app;
