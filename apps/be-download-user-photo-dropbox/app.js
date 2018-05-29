const communication = require("communication");
const logger = require("logging");
const config = require("config");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const mkdir = require("mkdir-recursive");
const destPath = config.get("images.path");
const dropbox = require("dropbox-api");
const user = require("provider-user");

mkdir.mkdirSync(destPath);

async function dropboxHandler(msg) {
  const metadata = JSON.parse(msg.data);
  const token = await user.getDropboxTokenByUserId(metadata.user);
  if (!token) { logger.error('Failed to get token for: ', metadata.photo); return; }

  // downloadImage(metadata, token);
  normalize(metadata, token);
}
async function normalize(metadata, token) {
  const thumbnails = await dropbox.getThumbnail(token, metadata.photo.path_lower)
  if (!thumbnails.success) { logger.info('Failed to fetch thumbnail: ', thumbnails.error); return; }

  const thumbnail = thumbnails.data.entries[0];
  if (thumbnail) {
    const normalized = normalizePhotoInfo(thumbnail, metadata.user);
    communication.publish("user-photo--normalized", normalized);
  }

}
function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: `data:image/jpeg;base64,${fileInfo.thumbnail}`,
    mimeType: 'image/jpeg',
    provider: 'Dropbox',
    providerId: fileInfo.id,
    original: fileInfo
  };
}
async function downloadImage(metadata, token) {
  const photos = await dropbox.getFile(token, metadata.photo.path_lower)
  if (!photos.success) { logger.info('Failed to fetch photo: ', photos.error); return; }

  const photo = photos.data.entries[0];

  const saved = await savePhotoToDisk(photo);
  if (saved) {
    const messageContentOut = {
      id: photo.id,
      extension: 'jpg'
    };
    communication.publish("user-photo--downloaded", messageContentOut);
  }
}
async function savePhotoToDisk(photo) {
  // fs.writeFile(`${destPath}/${photo.id}.jpg`, photo.thumbnail, 'base64', err => {
  //   logger.error('Could not save dropbox photo: ', photo.id);
  //   return false;
  // });
  return true;
}

const options = {
  channel: "user-photo--dropbox--received",
  durableName: "dropbox-downloader",
  clientId: "dropbox-downloader"
};
communication.subscribe(options, dropboxHandler);
