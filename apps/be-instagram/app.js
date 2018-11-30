#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const photoDb = require("photo-db");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.images.standard_resolution,
    mimeType: "image/jpeg",
    provider: "Instagram",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: "jpg",
    longitude: fileInfo.location ? fileInfo.location.longitude : 0,
    latitude: fileInfo.location ? fileInfo.location.latitude : 0
  };
}

const options = {
  channel: "user-photo--instagram--received",
  durableName: "instagram-preparer",
  clientId: "instagram-preparer"
};
communication.subscribe(options, async msg => {
  // Normalize and send to general photo queue
  const data = JSON.parse(msg.data);
  const normalized = normalizePhotoInfo(data.photo, data.user);

  // Insert into db
  const id = await photoDb.insert(normalized);

  // Prepare data for downloader
  const headers = {};
  const sizes = {
    large: { url: data.photo.images.standard_resolution.url, headers: headers },
    small: { url: data.photo.images.standard_resolution.url, headers: headers }
  };
  const extension = normalized.extension;
  const provider = normalized.provider;
  const user = data.user;
  const providerId = normalized.providerId;

  logger.info(`(Instagram) Prepared user photo ${id} for user ${data.user}`);
  communication.publish("user-photo--prepared", {
    id,
    extension,
    sizes,
    provider,
    providerId,
    user
  });
});
