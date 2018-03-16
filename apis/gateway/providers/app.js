"use strict";
const express = require("express");
const morgan = require("morgan");
const app = express();
const port = process.env.PROVIDERS_PORT | 3000;

// Enable access log
app.use(morgan("dev"));

// Mount google drive provider
app.use("/google-drive", require("./google-drive"));

// app.use("/facebook", ...);
// app.use("/instagram", ...);
// app.use("/dropbox", ...);

/* istanbul ignore next */
if (!module.parent) {
  // Start
  app.listen(port);
  console.log("Listening on port", port);
}

module.exports = app;