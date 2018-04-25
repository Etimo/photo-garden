const communication = require("communication");
const logger = require("logging");
const config = require("config");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo
  };
}

const options = {
  channel: "user-photo--google-drive--received",
  durableName: "google-drive-normalizer",
  clientId: "google-drive-normalizer"
};
communication.subscribe(options, msg => {
  // Normalize and send to general photo queue
  const data = JSON.parse(msg.data);
  const normalized = normalizePhotoInfo(data.photo, data.user);
  logger.info(`Normalized user photo ${data.photo.id} for user ${data.user}`);
  communication.publish("user-photo--normalized", normalized);
});
