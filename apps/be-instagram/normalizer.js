const communication = require("communication");
const logger = require("logging");
const config = require("config");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.images.standard_resolution,
    mimeType: "image/jpeg",
    provider: "Instagram",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: "jpg"
  };
}

function setup() {
  const options = {
    channel: "user-photo--instagram--received",
    durableName: "instagram-normalizer",
    clientId: "instagram-normalizer"
  };
  communication.subscribe(options, msg => {
    // Normalize and send to general photo queue
    const data = JSON.parse(msg.data);
    const normalized = normalizePhotoInfo(data.photo, data.user);
    logger.info(`Normalized user photo ${data.photo.id} for user ${data.user}`);
    communication.publish("user-photo--normalized", normalized);
  });
}

module.exports = {
  setup
}
