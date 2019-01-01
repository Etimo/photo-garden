const dbClient = require("db").create("garden");
const imagePath = require("image-path");

async function getAllPhotos(userId) {
  const response = await dbClient.query(
    `SELECT p.owner, p.id, p.provider, p.provider_id, p.original, p.latitude, p.longitude, p.extension, pe.edit, (ex.exif -> 'exif' ->> 'DateTimeOriginal') AS shootDate
    FROM photos p
   LEFT JOIN  photo_filter pe ON pe.photo_id = p.id
   LEFT JOIN photo_exif ex ON ex.photo_id = p.id
   WHERE p.OWNER = $1`,
    [userId]
  );

  return response.rows.map(mapRowToPhoto);
}

async function storePhotoEdit(photoId, edit) {
  await dbClient.query(
    "INSERT INTO photo_filter(photo_id, edit) VALUES($1, $2)",
    [photoId, edit]
  );
  return;
}

function mapRowToPhoto(row) {
  return {
    id: row.id,
    name: row.id, //todo find a real name,
    lat: row.latitude,
    long: row.longitude,
    provider: row.provider,
    shootDate: row.shootDate,
    edit: row.edit
      ? row.edit
      : {
          contrast: 100,
          brightness: 100,
          saturate: 100,
          sepia: 0,
          grayscale: 0,
          invert: 0,
          hueRotate: 0,
          blur: 0
        },
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
  getAllPhotos,
  storePhotoEdit
};
