#!/usr/bin/env node
//drive-api
const express = require("express");
const Router = require("express-promise-router");
const logger = require("logging");
const config = require("config");
const model = require("./model.js");

const port = config.get("apis.photos.port");
const appUrl = config.get("urls.app");

const app = express();
const router = new Router();
app.use(router);

router.get("/photos", async (req, res) => {
  const viewerId = req.query.user_id;
  const images = await model.findAll({
    owner: viewerId
  });
  res.header("Access-Control-Allow-Origin", appUrl);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.send(images);
});
router.get("/map", async (req, res) => {
  console.log(req.query);
  const images = await model.getAllPhotos(req.query.user_id);
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  res.send(images);
});

app.listen(port);
logger.info(`Listening on port ${port}`);
