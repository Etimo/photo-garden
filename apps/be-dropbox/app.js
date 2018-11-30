#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const fs = require("fs");
const dropbox = require("dropbox-api");
const dropboxDb = require("dropbox-db");
const photoDb = require("photo-db");

function normalizeLocation(fileInfo) {
  if (fileInfo.media_info) {
    return {
      longitude: fileInfo.media_info.metadata.location
        ? fileInfo.media_info.metadata.location.longitude
        : 0,
      latitude: fileInfo.media_info.metadata.location
        ? fileInfo.media_info.metadata.location.latitude
        : 0
    };
  }
  return {
    longitude: 0,
    latitude: 0
  };
}

function normalizePhotoInfo(fileInfo, user) {
  const location = normalizeLocation(fileInfo);
  return {
    owner: user,
    mimeType: "image/jpeg",
    provider: "Dropbox",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: "jpg",
    longitude: location.longitude,
    latitude: location.latitude
  };
}

const options = {
  channel: "user-photo--dropbox--received",
  durableName: "dropbox-downloader",
  // sequence: 25,
  clientId: "dropbox-downloader"
};
communication.subscribe(options, async msg => {
  const data = JSON.parse(msg.data);
  const token = await dropboxDb.getDropboxTokenByUserId(data.user);

  if (!token) {
    logger.error("Failed to get token for: ", data.photo);
    return;
  }

  const user = data.user;

  const normalized = normalizePhotoInfo(data.photo, user);

  // Insert into db
  const id = await photoDb.insert(normalized);
  // Prepare data for downloader
  const thumbnailUrl = "https://content.dropboxapi.com/2/files/get_thumbnail";
  const fullUrl = "https://content.dropboxapi.com/2/files/download";
  const headers = {
    Authorization: "Bearer " + token
  };
  const sizes = {
    large: {
      url: thumbnailUrl,
      headers: Object.assign({}, headers, {
        "Dropbox-API-Arg": JSON.stringify({
          path: data.photo.path_lower,
          format: "jpeg",
          size: "w480h320",
          mode: "bestfit"
        })
      })
    },
    small: {
      url: thumbnailUrl,
      headers: Object.assign({}, headers, {
        "Dropbox-API-Arg": JSON.stringify({
          path: data.photo.path_lower,
          format: "jpeg",
          size: "w256h256",
          mode: "bestfit"
        })
      })
    },
    exif: {
      url: fullUrl,
      headers: Object.assign({}, headers, {
        "Dropbox-API-Arg": JSON.stringify({
          path: data.photo.path_lower
        }),
        Range: "bytes=0-40960"
      })
    }
  };
  const extension = normalized.extension;
  const provider = normalized.provider;
  const providerId = normalized.providerId;

  logger.info(`(Dropbox) Prepared user photo ${id} for user ${data.user}`);
  communication.publish("user-photo--prepared", {
    id,
    extension,
    sizes,
    provider,
    providerId,
    user
  });
});
