const { Client: PgClient } = require("pg");
const dbClient = new PgClient();
dbClient.connect();

async function findAll(filters) {
  if (filters === undefined) {
    filters = {};
  }
  const response = await dbClient.query(
    "SELECT id, url, mime_type FROM photos WHERE (owner=$1 OR $1 IS NULL)",
    [filters.owner]
  );
  return response.rows;
}

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

module.exports = {
  findAll,
  insert
};
