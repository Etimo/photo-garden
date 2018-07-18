const dbClient = require("db").create("garden");
const imagePath = require("image-path");
dbClient.connect();

async function findAll(filters) {
  if (filters === undefined) {
    filters = {};
  }
  const response = await dbClient.query(
    "SELECT p.id, p.owner, p.provider, p.provider_id, p.extension, p.mime_type, pc.r, pc.g, pc.b, pc.a FROM photos p LEFT JOIN photo_color pc ON p.id = pc.photo_id WHERE (owner=$1 OR $1 IS NULL)",
    [filters.owner]
  );
  return response.rows.map(image => {
    image.url_thumbnail = imagePath.getUrl(
      image.owner,
      image.provider,
      image.provider_id + "small",
      image.extension
    );
    image.url = imagePath.getUrl(
      image.owner,
      image.provider,
      image.provider_id + "large",
      image.extension
    );
    return image;
  });
}

module.exports = {
  findAll
};
