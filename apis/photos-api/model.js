const { Client: PgClient } = require('pg');
const dbClient = new PgClient();
dbClient.connect();

async function findAll(filters) {
  if (filters === undefined) {
    filters = {};
  }
  const response = await dbClient.query("SELECT id, url, mime_type FROM photos WHERE (owner=$1 OR $1 IS NULL)", [filters.owner]);
  return response.rows;
}

async function insert(image) {
  const response = await dbClient.query(
    "INSERT INTO photos(owner, url, mime_type, provider, original) VALUES($1, $2, $3, $4, $5) RETURNING id",
    [image.owner,
     image.url,
     image.mimeType,
     image.provider,
     image.original]
  );
  return response.rows[0].id;
}

module.exports = {
  findAll,
  insert
};
