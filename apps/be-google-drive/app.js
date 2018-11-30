#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const config = require("config");
const photoDb = require("photo-db");
const googleTokens = require("provider-google-drive-tokens");

function normalizePhotoInfo(fileInfo, user) {
  const location = (fileInfo.imageMediaMetadata &&
    fileInfo.imageMediaMetadata.location) || {
    longitude: 0,
    latitude: 0
  };
  return {
    owner: user,
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: fileInfo.fileExtension,
    longitude: location.longitude,
    latitude: location.latitude
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

  const userTokens = JSON.parse(await googleTokens.getTokens(data.user));
  const accessToken = userTokens.access_token;

  // Prepare for downloader
  const authHeaders = {
    Authorization: `Bearer ${accessToken}`
  };
  const sizes = {
    small: {
      url: data.photo.thumbnailLink
    },
    large: {
      url: data.photo.thumbnailLink
    }
    // large: {
    //   url: `https://www.googleapis.com/drive/v3/files/${
    //     data.photo.id
    //   }?alt=media`,
    //   headers: authHeaders
    // },
    // exif: {
    //   url: `https://www.googleapis.com/drive/v3/files/${
    //     data.photo.id
    //   }?alt=media`,
    //   headers: Object.assign({}, authHeaders, {
    //     Range: "bytes=0-40960"
    //   })
    // },
  };

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
