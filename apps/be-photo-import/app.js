const communication = require("communication");
const logger = require("logging");
const config = require("config");
const dbClient = require("db").create("garden");
const downloader = require("image-downloader");
const mkdir = require("mkdir-recursive");
const imagePath = require("image-path");

async function insert(image) {
  const urlThumbnail = imagePath.getUrl(
    image.owner,
    image.provider,
    image.providerId + "-thumbnail",
    image.extension
  );
  const urlFull = imagePath.getUrl(
    image.owner,
    image.provider,
    image.providerId,
    image.extension
  );
  const response = await dbClient.query(
    "INSERT INTO photos(owner, url_thumbnail, url, mime_type, provider, provider_id, original) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT ON CONSTRAINT provider_id_unique DO NOTHING RETURNING id",
    [
      image.owner,
      urlThumbnail,
      urlFull,
      image.mimeType,
      image.provider,
      image.providerId,
      image.original
    ]
  );
  return response.rows[0] !== undefined ? response.rows[0].id : undefined;
}
async function storeColors(photoId, image) {
  logger.info(image.color, "color", photoId);
  if (image.color) {
    var response = await dbClient.query(
      "insert into photo_color(photo_id, r, g, b, a) values($1, $2, $3, $4, $5)",
      [photoId, image.color.r, image.color.g, image.color.b, image.color.a]
    );
    return response.rows[0] !== undefined ? response.rows[0].id : undefined;
  }
  return null;
}

async function addImage(msg) {
  try {
    const image = JSON.parse(msg.data);
    const id = await insert(image);
    // await channel.ack(msg);
    if (id !== undefined) {
      const colorId = await storeColors(id, image);
      // logger.info(`Imported image for user ${image.owner} as ${id}`);
    }
  } catch (err) {
    // await channel.nack(msg);
    logger.error(`Failed to import image: ${err}, returning to the queue...`);
  }
}

const options = {
  channel: "user-photo--normalized",
  durableName: "user-photo--persister",
  clientId: "user-photo--persister"
};
communication.subscribe(options, addImage);
