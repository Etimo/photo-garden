const dbClient = require("db").create("garden");

async function setExif(photoId, exif) {
  const response = await dbClient.query(
    "INSERT INTO photo_exif (photo_id, exif) VALUES ($1, $2) ON CONFLICT DO NOTHING ",
    [photoId, exif]
  );
  return response;
}

module.exports = {
  setExif
};
