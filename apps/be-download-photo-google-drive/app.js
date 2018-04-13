const communication = require("communication");
const logger = require("logging");
const config = require("config");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const mkdir = require("mkdir-recursive");
const destPath = config.get("images.path");

mkdir.mkdirSync(destPath);

async function downloadImage(msg, channel) {
  try {
    // TODO: We might need to add support for images that have expired

    const metadata = JSON.parse(msg.content);
    const options = {
      url: metadata.thumbnailLink,
      dest: `${destPath}/${metadata.id}.${metadata.fileExtension}`
    };

    const { filename, image } = await imageDownloader.image(options);
    // TODO: Check logged and remove logging
    logger.info(image);

    const messageContentOut = {
      id: metadata.id,
      extension: metadata.fileExtension
    };

    logger.info(messageContentOut);
    logger.info(metadata);

    communication.queue.publish(
      "photo-downloaded-update-db",
      messageContentOut
    );
    channel.ack(msg);
  } catch (err) {
    await channel.nack(msg);
    logger.error(`Failed to download image: ${err}, returning to the queue...`);
  }
}

communication.queue.consume("new-photo-download-google-drive", downloadImage);
