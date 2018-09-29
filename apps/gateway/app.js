#!/usr/bin/env node

const providers = require("./providers");
const logger = require("logging");
const express = require("express");
const config = require("config");

const path = require("path");
const sessions = require("client-sessions");
const GoogleAuth = require("google-auth-library");
const bodyParser = require("body-parser");
const axios = require("axios");

const auth = new GoogleAuth();
const app = express();
const port = config.get("gateway.port");
const appUrl = config.get("urls.app");
const photosApiBaseUrl = config.get("serviceUrls.photos");

//Login-block
const asyncWrapper = wrapFunction => (req, res, next) => {
  Promise.resolve(wrapFunction(req, res, next)).catch(next);
};

app.use(
  sessions({
    cookieName: config.get("gateway.cookieName"),
    secret: config.get("gateway.secret"),
    duration: 15 * 60 * 1000, // Refresh
    activeDuration: 10 * 60 * 1000,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false
    },
    resave: true
  })
);

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", [isAuthenticated], (req, res) => {
  res.redirect(appUrl);
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/html/login.html"));
});
app.get("/logout", (req, res) => {
  req.gardenSession.reset();
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.redirect("/login");
});

app.get("/user", [allowCors, isAuthenticated], (req, res) => {
  res.json({ user: req.gardenSession.userIdentity });
});

app.get("/user/me/photos", [allowCors, isAuthenticated], (req, res, next) => {
  axios
    .get("/photos", {
      baseURL: photosApiBaseUrl,
      params: {
        user_id: req.gardenSession.userIdentity
      }
    })
    .then(response => res.json(response.data))
    .catch(next);
});

function allowCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", appUrl);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  return next();
}

function isAuthenticated(req, res, next) {
  logger.info("logged in as: ", req.gardenSession.userIdentity);
  if (req.gardenSession.userIdentity) {
    return next();
  } else {
    res.status(401).send("You are not logged in");
  }
}
// Mount providers
app.use(providers);

app.listen(port);
logger.info(`Listening on port ${port}`);
