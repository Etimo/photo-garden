const dbClient = require("db").create("garden");
dbClient.connect();

async function findAll(filters) {
  if (filters === undefined) {
    filters = {};
  }
  const response = await dbClient.query(
    "SELECT p.id, p.url, p.mime_type, pc.r, pc.g, pc.b, pc.a FROM photos p LEFT JOIN photo_color pc ON p.id = pc.photo_id WHERE (owner=$1 OR $1 IS NULL)",
    [filters.owner]
  );
  return response.rows;
}

module.exports = {
  findAll
};
