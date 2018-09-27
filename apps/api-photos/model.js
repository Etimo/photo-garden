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

async function findAllMap(filters) {
  if (filters === undefined) {
    filters = {};
  }
  const response = await dbClient.query(
    "SELECT p.owner, p.id, p.provider, p.provider_id, p.original, p.latitude, p.longitude, p.extension FROM photos p  WHERE (owner=$1 OR $1 IS NULL)",
    [filters.owner]
  );
  return response.rows.map(photo => {
    //  switch(photo.provider) {
    //  case "Google":
    return mapRowToPhoto(photo);
    //    break;
    // case "instagram":
    //   return getInstagramPhoto(photo);
    // break;
    //default:
    //return photoObj={};

    //}
  });

  function mapRowToPhoto(row) {
    var photoObj = {};
    var id = row.id;
    var provider = row.provider;
    var providerId = row.provider_id;
    var extension = row.extension;
    var thumbnailLink = imagePath.getUrl(
      row.owner,
      provider,
      providerId,
      extension,
      imagePath.imageType.small
    );
    //photo.original.thumbnailLink;

    var webViewLink = imagePath.getUrl(
      row.owner,
      provider,
      providerId,
      extension,
      imagePath.imageType.large
    );
    var name = row.id; //todo find a real name
    var lat = row.latitude;
    var long = row.longitude;

    photoObj = {
      id,
      name,
      lat,
      long,
      provider,
      thumbnailLink,
      webViewLink
    };

    return photoObj;
  }

  function getInstagramPhoto(photo) {
    var photoObj = {};
    var id = photo.id;
    var provider = photo.provider;
    var thumbnailLink = photo.original.images.thumbnail.url;
    var webViewLink = photo.original.images.low_resolution.url;
    var name = photo.original.caption.text;
    var lat = getRandomInRange(59.3210922667, 59.5210922667, 8); //59.3210922667;
    var long = getRandomInRange(17.509316333, 18.2509316333, 8); //18.0509316333;

    photoObj = {
      id,
      name,
      lat,
      long,
      provider,
      thumbnailLink,
      webViewLink
    };

    return photoObj;
  }
}

module.exports = {
  findAll,
  findAllMap
};
