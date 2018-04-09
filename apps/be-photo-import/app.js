const communication = require("communication");
const logger = require("logging");
const dbClient = require("db").create("garden");

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

communication.queue.consume("new-photo", addImage);
