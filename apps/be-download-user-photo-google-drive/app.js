#!/usr/bin/env node
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
    const options = {
      url: photo.thumbnailLink,
      dest: imagePath.getFullPathAndFile(
        user,
        "Google",
        photo.id,
        photo.fileExtension
      )
    };

    // Create path to download to, if not already existing
    imagePath.assertPath(user, "Google", photo.id, photo.fileExtension);

    const { filename, image } = await imageDownloader.image(options);

    const messageContentOut = {
      id: photo.id,
      extension: photo.fileExtension
    };

    logger.info(`Downloaded image ${photo.id} to ${options.dest}`);
    communication.publish("user-photo--downloaded", messageContentOut);
  } catch (err) {
    // await channel.nack(msg);
    logger.error(`Failed to download image: ${err}, returning to the queue...`);
  }
}

const options = {
  channel: "user-photo--google-drive--received",
  durableName: "google-drive-downloader",
  clientId: "google-drive-downloader"
};
communication.subscribe(options, downloadImage);
