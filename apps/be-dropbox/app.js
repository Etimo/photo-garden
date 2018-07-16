#!/usr/bin/env node
const communication = require("communication");
const logger = require("logging");
const fs = require("fs");
const dropbox = require("dropbox-api");
const dropboxDb = require("dropbox-db");
const imagePath = require("image-path");
const photoDb = require("photo-db");
const photoColor = require("photo-color");

// async function dropboxHandler(msg) {
//   const metadata = JSON.parse(msg.data);
//   const token = await dropboxDb.getDropboxTokenByUserId(metadata.user);
//   if (!token) {
//     logger.error("Failed to get token for: ", metadata.photo);
//     return;
//   }
//   downloadImage(metadata, token);
// }
async function normalize(metadata, token) {
  const thumbnails = await dropbox.getThumbnail(
    token,
    metadata.photo.path_lower
  );
  if (!thumbnails.success) {
    logger.info("Failed to fetch thumbnail: ", thumbnails.error);
    return;
  }

  const thumbnail = thumbnails.data.entries[0];
  if (thumbnail) {
    const color = photoColor.getAverageFromBase64(thumbnail.thumbnail);
    const normalized = normalizePhotoInfo(thumbnail, color, metadata.user);
    communication.publish("user-photo--normalized", normalized);
  }
}
async function downloadImage(metadata, token) {
  const photos = await dropbox.getFile(token, metadata.photo.path_lower);
  if (!photos.success) {
    logger.warn("Failed to fetch photo: ", photos.error);
    return;
  }
  imagePath.assertPath(metadata.user, "Dropbox", metadata.photo.id, "jpg");

  const saved = await savePhotoToDisk(
    metadata.user,
    metadata.photo.id,
    photos.data.entries[0].thumbnail
  );
  if (saved.success) {
    const messageContentOut = {
      id: metadata.photo.id,
      extension: "jpg"
    };
    communication.publish("user-photo--downloaded", messageContentOut);
    normalize(metadata, token);
  }
}

async function savePhotoToDisk(user, id, photo) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      imagePath.getFullPathAndFile(user, "Dropbox", id, "jpg"),
      photo,
      "base64",
      err => {
        if (err) {
          resolve({
            success: false,
            error: err
          });
        } else {
          resolve({
            success: true,
            data: null
          });
        }
      }
    );
  });
}

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    mimeType: "image/jpeg",
    provider: "Dropbox",
    providerId: fileInfo.id,
    original: fileInfo,
    extension: "jpg"
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
