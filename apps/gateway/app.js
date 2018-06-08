require("dotenv").config();
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
    activeDuration: 10 * 60 * 1000,
    cookie: {
      secure: false
    },
    saveUninitialized: true
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", [isAuthenticated], (req, res) => {
  res.redirect("http://localhost:3001");
});

app.get("/login", (req, res) => {
  req.gardenSession.reset();
  res.sendFile(path.join(__dirname, "/public/html/login.html"));
});
app.get("/logout", (req, res) => {
  req.gardenSession.reset();
  res.redirect("/login");
});

app.get("/user", [isAuthenticated, allowCors], (req, res) => {
  res.json({ user: req.gardenSession.userIdentity });
});

function allowCors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  return next();
}

function isAuthenticated(req, res, next) {
  req.gardenSession.userIdentity = "7509d0e0-702b-4758-bd65-203ea38cf756";
  return next();
  logger.info("SESSION IN GATEWAY", req.gardenSession);
  if (req.gardenSession.userIdentity) {
    return next();
  } else {
    res.status(401).send("You are not logged in");
  }
  //
  //res.redirect("http://localhost:3000/login");
}
// Mount providers
app.use(providers);

app.listen(port);
logger.info(`Listening on port ${port}`);
