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
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      secure: false,
    },
    resave: true
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", [isAuthenticated], (req, res) => {
  res.redirect("http://localhost:3001");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/html/login.html"));
});
app.get("/logout", (req, res) => {
  req.gardenSession.reset();
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.redirect("/login");
});

app.get("/user", [allowCors, isAuthenticated], (req, res) => {
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
  logger.info('logged in as: ', req.userIdentity);
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
