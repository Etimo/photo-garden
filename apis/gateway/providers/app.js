"use strict";
const express = require("express");
const logger = require("logging").logger;

const app = express();
const port = process.env.PROVIDERS_PORT | 3000;

logger.info("Starting app...");
// Mount google drive provider
const providers = ["google-drive"];
providers.forEach(provider => {
  logger.info(`Mounting provider ${provider}...`);
  app.use(`/${provider}`, require(`provider-${provider}`));
});

// app.use("/facebook", ...);
// app.use("/instagram", ...);
// app.use("/dropbox", ...);

/* istanbul ignore next */
if (!module.parent) {
  // Start
  app.listen(port);
  logger.info("Listening on port", port);
}

module.exports = app;
