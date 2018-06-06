const logger = require("logging");
const communication = require("communication");
const https = require("https");
const dropboxApi = require("dropbox-api");
const dropboxDb = require("dropbox-db");

const publishToQueue = (item, user) => {
  communication.publish("user-photo--dropbox--received", {
    user: user,
    photo: item
  });
};

const fetchPhotos = async (token, user) => {
  const nextPageToken = await dropboxDb.getDropboxNextPageTokenByUserId(user);
  let photoList = await dropboxApi.getPhotos(token, nextPageToken);
  if (!photoList.success) {
    return;
  }

  photoList.data.matches.forEach(match => publishToQueue(match.metadata, user));
  if (photoList.data.matches.length === 25) {
    await dropboxDb.setDropboxNextPageToken(user, nextPageToken + 1);
    fetchPhotos(token, user);
  } else {
    return;
  }
};

module.exports = {
  fetchPhotos
};
