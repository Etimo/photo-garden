const logger = require("logging");
const communication = require("communication");
const https = require("https");
const dropbox = require("../lib/dropbox");
const repo = require("provider-user");

const publishToQueue = (item, user) => {

  communication.publish("user-photo--dropbox--received", {
    user: user,
    photo: item
  });
}

const fetchPhotos = async (token, user) => {
  logger.info('user in worker', user);
  const nextPageToken = await repo.getDropboxNextPageTokenByUserId(user);
  let photoList = await dropbox.getPhotos(token, nextPageToken);
  if (!photoList.success) {
    return;
  }

  photoList.data.matches.forEach(match => publishToQueue(match.metadata, user));
  await repo.setDropboxNextPageToken(user);
  fetchPhotos(token, user);
}

module.exports = {
  fetchPhotos
};
