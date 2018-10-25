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
  let photoList = await dropboxApi.getPhotos(token, 0);
  if (!photoList.success) {
    return;
  }

  photoList.data.matches.forEach(match => publishToQueue(match.metadata, user));
};

module.exports = {
  fetchPhotos
};
