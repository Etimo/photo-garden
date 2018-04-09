const communication = require("communication");
const logger = require("logging");

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

communication.queue.consume("new-photo-url", addImage);
