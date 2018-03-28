'use strict'
const providersApp = require("./providers/app");
const logger = require("logging").logger;
const express = require("express");
const secret = process.argv.secret ? process.argv.secret : "NotAGoodSecret";
const path = require("path");
const sessions = require("client-sessions");
const GoogleAuth = require("google-auth-library");
const auth = new GoogleAuth;
const CLIENT_ID = "212991127628-8rj19c00v2d1tpl9v3rpd2vd740o6d96.apps.googleusercontent.com";
const client = new auth.OAuth2(CLIENT_ID, '', '');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//Login-block
const asyncWrapper = (wrapFunction) =>
  (req, res, next) => {
    Promise.resolve(wrapFunction(req, res, next))
      .catch(next);
  };

app.use(sessions({
  cookieName: "gardenSession",
  secret: secret,
  duration: 15 * 60 * 1000, // Refresh
  activeDuration: 10 * 60 * 1000,
}));

app.use(
  bodyParser.json());
app.use(
  express.static("public"));

app.get("/", (req, res) => {
  const gardener = req.gardenSession.userIdentity;
  if (gardener && gardener.length > 0) {
    res.sendFile(path.join(__dirname, "/public/spa.html"));
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/html/login.html"));
});
app.get("/logout", (req, res) => {
  req.gardenSession.reset();
  res.sendFile(path.join(__dirname, "/public/html/logout.html"));
});

app.use(providersApp);
app.listen(port);
logger.info(`Listening on port ${port}`);

// module.exports = express();

//Providers block
