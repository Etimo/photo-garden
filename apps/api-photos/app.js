//drive-api
const express = require("express");
const Router = require("express-promise-router");
const logger = require("logging");

const config = require("config");
const model = require("./model.js");

const port = config.get("apis.photos.port");
const app = express();
const router = new Router();

app.use(express.static("public"));
app.use(router);

router.get("/photos", async (req, res) => {
  const viewerId = req.query.user_id;
  const images = await model.findAll({
    owner: viewerId
  });
  res.header("Access-Control-Allow-Origin", "http://localhost:3001");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.send(images);
});
router.post("/photos", async (req, res) => {
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

async function insert(image) {
  const response = await dbClient.query(
    "INSERT INTO photos(owner, url, mime_type, provider, provider_id, original) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT ON CONSTRAINT provider_id_unique DO NOTHING RETURNING id",
    [
      image.owner,
      image.url,
      image.mimeType,
      image.provider,
      image.providerId,
      image.original
    ]
  );
  return response.rows[0] !== undefined ? response.rows[0].id : undefined;
}

app.listen(port);
logger.info(`Listening on port ${port}`);
