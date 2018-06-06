const communication = require("communication");
const logger = require("logging");
const config = require("config");
const dbClient = require("db").create("garden");
const downloader = require("image-downloader");
const mkdir = require("mkdir-recursive");
const destPath = config.get("images.path");

mkdir.mkdirSync(destPath);

async function insert(image) {
  const response = await dbClient.query(
    "INSERT INTO photos(owner, url, mime_type, provider, provider_id, original) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT ON CONSTRAINT provider_id_unique DO NOTHING RETURNING id",
    [
      image.owner,
      image.url,
      image.mimeType,
      image.provider,
      image.providerId,
      image.original
    ]
  );
  return response.rows[0] !== undefined ? response.rows[0].id : undefined;
}

async function addImage(msg) {
  try {
    const image = JSON.parse(msg.data);
    const id = await insert(image);
    // await channel.ack(msg);
    if (id !== undefined) {
      logger.info(`Imported image for user ${image.owner} as ${id}`);
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
