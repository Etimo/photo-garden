'use strict'
const express = require("express");
const path = require("path");
const google = require("googleapis");
const sessions = require("client-sessions");
const GoogleAuth = require("google-auth-library");
const auth = new GoogleAuth;
const CLIENT_ID = "212991127628-8rj19c00v2d1tpl9v3rpd2vd740o6d96.apps.googleusercontent.com";
const client = new auth.OAuth2(CLIENT_ID, '', '');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("I AM A MAN OF CONSTANT SOROOOOOOOOWWW!!!!");
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/login.html"));
});


app.post("/actuallylogin", (req, res) => {
  const key = req.body.idToken;
  client.verifyIdToken(
    key,
    CLIENT_ID,
    (e, login) => {
      const payload = login.getPayload();
      console.log("LOOOOOOGGG!!! "+JSON.stringify(payload));
      });
  res.send("I AM IMMORTAL, AND NO MAN CAN BE MY EQUAL!");
});

app.listen(3000);
console.log("Listening on localhost:3000")

const getUserIdentity = (userIdentifier) => {
  //DO A LOOKUP FOR USER IDENTITY

}
module.exports = express();

