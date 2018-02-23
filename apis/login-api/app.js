'use strict'
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

const asyncWrapper = (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.use(sessions({
  cookieName: "gardenSession",
  secret: secret,
  duration: 15 * 60 * 1000, // Refresh
  activeDuration: 10 * 60 * 1000,
}));

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  const gardener = req.gardenSession.userIdentity;
  if (gardener) {
    res.sendFile(path.join(__dirname + "/public/html/main.html"));
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/html/login.html"));
});
app.get("/logout", (req, res) => {
  req.gardenSession.reset();
  res.sendFile(path.join(__dirname + "/public/html/logout.html"));
});

const getUserIdentity = (verified, userIdentifier, req) => {
  //DO A LOOKUP FOR USER IDENTITY USING USERIDENTIFIER AS A KEY!
  //Todo: Look at actual fields.
  const userIdentity = {
    guid: "1111111"
  };
  if (userIdentity) {
    req.gardenSession.userIdentity = userIdentity.guid;
    return true;
  }
  return false;


};

app.post("/actuallylogin", asyncWrapper(async (req, res, next) => {
  const key = req.body.idToken;
  client.verifyIdToken(
    key,
    CLIENT_ID,
    (e, login) => {
      const payload = login.getPayload();
      res.status = getUserIdentity(payload.verified, payload.email, req, res) ? 200 : 401;
      res.send("Done");
    });
})
);

app.listen(3000);
console.log("Listening on localhost:3000");
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: "It's dead jim" });
});
module.exports = express();

