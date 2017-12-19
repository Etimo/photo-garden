"use strict";

const express = require("express");
const app = express();
const setup = require("./lib/setup");

setup.init(app);

function helloRespond(request, response) {
  const name = request.params.name || "Etimo";
  response.send(`Well, hello there ${name}!`);
}

app.get("/", (request, response) => {
  helloRespond(request, response);
});
app.get("/hello/:name", (request, response) => {
  helloRespond(request, response);
});

app.get("/featureflags", (request, response) => {

  const flagName = "ReadGoogleDriveFolders";
  const { isEnabled } = require("./lib/featureFlags");

  const isDriveEnabled = isEnabled(flagName);

  // real implementation would be to call google drive functionality
  // if(isDriveEnabled)
  // otherwise not
  response.send(`${flagName}: ${isDriveEnabled}`);
});

app.get("/newendpoint", (request, response) => {
  response.send("The deploy worked!");
});

app.listen(3000);

module.exports = app;
