const communication = require("communication");
const logger = require("logging");
const config = require("config");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const mkdir = require("mkdir-recursive");
const dropbox = require("dropbox-api");
const dropboxDb = require("dropbox-db");
const imagePath = require("image-path");

async function dropboxHandler(msg) {
  const metadata = JSON.parse(msg.data);
  const token = await dropboxDb.getDropboxTokenByUserId(metadata.user);
  if (!token) {
    logger.error("Failed to get token for: ", metadata.photo);
    return;
  }
  downloadImage(metadata, token);
}
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
    const normalized = normalizePhotoInfo(thumbnail, metadata.user);
    communication.publish("user-photo--normalized", normalized);
  }
}
function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    mimeType: "image/jpeg",
    provider: "Dropbox",
    providerId: fileInfo.metadata.id,
    original: fileInfo,
    extension: "jpg"
  };
}
async function downloadImage(metadata, token) {
  logger.info("Metadata", metadata);
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
      extension: ".jpg"
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
        logger.error("Could not save dropbox photo: ", id, err);
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

const options = {
  channel: "user-photo--dropbox--received",
  durableName: "dropbox-downloader",
  clientId: "dropbox-downloader"
};
communication.subscribe(options, dropboxHandler);
