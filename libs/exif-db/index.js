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

module.exports = {
  setExif,
  setLongLatFromExif
};
