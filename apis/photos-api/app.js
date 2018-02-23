//drive-api
const express = require('express');
const Router = require('express-promise-router');

const { Client: PgClient } = require('pg');
const dbClient = new PgClient();
dbClient.connect();

const app = express();
const router = new Router()
let accessToken;
app.use(express.static('public'));
app.use(router);


router.get('/photos', async function (req, res) {
  const viewerId = req.query.user_id;

  const dbImages = await dbClient.query("SELECT id, url, mime_type FROM photos WHERE (owner=$1 OR $1 IS NULL)", [viewerId]);
  res.send(dbImages.rows);
});


app.listen(3000);
console.log("Listening on localhost:3000")
