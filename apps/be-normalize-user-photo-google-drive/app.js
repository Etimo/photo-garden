#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const config = require("config");
const photoDb = require("photo-db");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: fileInfo.fileExtension
  };
}

const options = {
  channel: "user-photo--google-drive--received",
  durableName: "google-drive-normalizer",
  clientId: "google-drive-normalizer"
};
communication.subscribe(options, async msg => {
  // Normalize and send to general photo queue
  const data = JSON.parse(msg.data);
  const normalized = normalizePhotoInfo(data.photo, data.user);

  const id = await photoDb.insert(normalized);

  // Prepare for downloader
  const thumbnailUrl = data.photo.thumbnailLink;
  const sizes = {
    small: {
      url: thumbnailUrl
    },
    large: {
      url: thumbnailUrl
    }
  };
  console.log(sizes);

  logger.info(`Normalized user photo ${data.photo.id} for user ${data.user}`);
  communication.publish("user-photo--prepared", {
    id,
    user: data.user,
    sizes,
    extension: normalized.extension,
    provider: normalized.provider,
    providerId: normalized.providerId
  });
});
