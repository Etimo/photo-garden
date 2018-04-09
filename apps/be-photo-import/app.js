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

async function addImage(msg, channel) {
  try {
    const image = JSON.parse(msg.content);
    const id = await insert(image);
    await channel.ack(msg);
    if (id !== undefined) {
      logger.info(`Imported image for user ${image.owner} as ${id}`);
    }
  } catch (err) {
    await channel.nack(msg);
    logger.error(`Failed to import image: ${err}, returning to the queue...`);
  }
}

async function downloadImage(msg, channel) {
  try {
    const image = JSON.parse(msg.content);

    // Create path if not existing
    const userPath = `${destPath}/${image.user}`;
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath);
    }

    // Setup filename
    const filename = `${userPath}/${image.id}.${image.extension}`;
    const options = {
      url: image.url,
      dest: filename
    };

    // Download file
    const result = await downloader.image(options);
    await channel.ack(msg);
    logger.info(`Downloaded image ${image.id}`);
  } catch (err) {
    await channel.nack(msg);
    logger.error(`Failed to download image: ${err}, returning to the queue...`);
  }
}

communication.queue.consume("new-photo", addImage);
