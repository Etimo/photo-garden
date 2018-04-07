const dbClient = require("db").create();
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

module.exports = {
  findAll
};
