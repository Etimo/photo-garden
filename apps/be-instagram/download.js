const communication = require("communication");
const logger = require("logging");
const config = require("config");
const imageDownloader = require("image-downloader");
const imagePath = require("image-path");

async function downloadImage(msg) {
  try {
    // TODO: We might need to add support for images that have expired
    const metadata = JSON.parse(msg.data);
    const photo = metadata.photo;
    const user = metadata.user;
    const extension = "jpg"

    // Create path to download to, if not already existing
    imagePath.assertPath(user, "Instagram", photo.id, extension);

    // Download thumbnail
    let options = {
      url: photo.images.thumbnail.url,
      dest: imagePath.getFullPathAndFile(
        user,
        "Instagram",
        photo.id + "-thumbnail",
        extension
      )
    };
    await imageDownloader.image(options);
    logger.info(`Downloaded thumbnail image ${photo.id} to ${options.dest}`);

    // Download full image
    options = {
      url: photo.images.standard_resolution.url,
      dest: imagePath.getFullPathAndFile(
        user,
        "Instagram",
        photo.id,
        extension
      )
    };
    await imageDownloader.image(options);

    const messageContentOut = {
      id: photo.id,
      extension
    };
    logger.info(`Downloaded full image ${photo.id} to ${options.dest}`);

    communication.publish("user-photo--downloaded", messageContentOut);
  } catch (err) {
    // await channel.nack(msg);
    logger.error(`Failed to download image: ${err}, returning to the queue...`);
  }
}

function setup() {
  const options = {
    channel: "user-photo--instagram--received",
    durableName: "instagram-downloader",
    clientId: "instagram-downloader"
  };
  communication.subscribe(options, downloadImage);
}

module.exports = {
  setup
}
