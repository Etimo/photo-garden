const dbClient = require("db").create("garden");

async function setExif(photoId, exif) {
  const response = await dbClient.query(
    "INSERT INTO photo_exif (photo_id, exif) VALUES ($1, $2) ON CONFLICT DO NOTHING ",
    [photoId, exif]
  );
  return response;
}

async function setLongLatFromExif(photoId, longitude, latitude) {
  const response = await dbClient.query(
    "UPDATE  photos SET longitude = $1, latitude =$2 WHERE id = $3",
    [longitude, latitude, photoId]
  );
  return response;
}
async function setColor(photoId, color) {
  const response = await dbClient.query(
    "INSERT INTO photo_color (photo_id, r, g, b) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING ",
    [photoId, color.r, color.g, color.b]
  );
  return response;
}
module.exports = {
  setExif,
  setLongLatFromExif
};
