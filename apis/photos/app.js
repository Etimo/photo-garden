//drive-api
const express = require("express");
const Router = require("express-promise-router");

const model = require("./model.js");
const queueImport = require("./queue-import.js");

const app = express();
const router = new Router();
app.use(express.static("public"));
app.use(router);

router.get("/photos", async function(req, res) {
  const viewerId = req.query.user_id;

  const images = await model.findAll({
    owner: viewerId
  });
  res.send(images);
});

router.post("/photos", async function(req, res) {
  const owner = req.query.user_id;
  const url = req.query.url;
  const mimeType = req.query.mime_type;

  const id = await model.insert({
    owner,
    url,
    mimeType
  });
  res.send({ id });
});

app.listen(3000);
queueImport.start();
console.log("Listening on localhost:3000");
