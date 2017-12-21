var express = require('express');
var morgan = require("morgan");
var app = express();
var port = process.env.PROVIDERS_PORT | 3000;

// Enable access log
app.use(morgan("dev"));

// Mount google drive provider
app.use("/google-drive", require('./google-drive'));

// app.use("/facebook", ...);
// app.use("/instagram", ...);
// app.use("/dropbox", ...);

/* istanbul ignore next */
if (!module.parent) {
  // Start
  app.listen(port);
  console.log("Listening on port", port);
}
