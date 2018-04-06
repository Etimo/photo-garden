const providers = require("./providers");
const logger = require("logging");
const express = require("express");
const config = require("config");

const path = require("path");
const sessions = require("client-sessions");
const GoogleAuth = require("google-auth-library");
const bodyParser = require("body-parser");

const auth = new GoogleAuth();
const app = express();
const port = config.get("gateway.port");

//Login-block
const asyncWrapper = wrapFunction => (req, res, next) => {
  Promise.resolve(wrapFunction(req, res, next)).catch(next);
};

app.use(
  sessions({
    cookieName: config.get("gateway.cookieName"),
    secret: config.get("gateway.secret"),
    duration: 15 * 60 * 1000, // Refresh
    activeDuration: 10 * 60 * 1000
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

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

// Mount providers
app.use(providers);

app.listen(port);
logger.info(`Listening on port ${port}`);
