const dbClient = require("db").create("garden");
const imagePath = require("image-path");

async function getAllPhotos(userId) {
  if (!userId) {
    throw "userId must be specified";
  }

  const response = await dbClient.query(
    "SELECT p.owner, p.id, p.provider, p.provider_id, p.original, p.latitude, p.longitude, p.extension " +
      "FROM photos p " +
      "WHERE owner=$1",
    [userId]
  );

  return response.rows.map(mapRowToPhoto);
}

function mapRowToPhoto(row) {
  return {
    id: row.id,
    name: row.id, //todo find a real name,
    lat: row.latitude,
    long: row.longitude,
    provider: row.provider,
    thumbnailLink: imagePath.getUrl(
      row.owner,
      row.provider,
      row.provider_id,
      row.extension,
      imagePath.imageType.small
    ),
    webViewLink: imagePath.getUrl(
      row.owner,
      row.provider,
      row.provider_id,
      row.extension,
      imagePath.imageType.large
    )
  };
}

module.exports = {
  getAllPhotos
};
