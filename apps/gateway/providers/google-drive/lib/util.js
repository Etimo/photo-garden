const google = require("googleapis");
const logger = require("logging");
const config = require("config");
const GoogleAuth = require("google-auth-library");

const auth = new GoogleAuth();

// Get config vars
const validPhotos = config.get("providers.googleDrive.validPhotos");
const scopes = config.get("providers.googleDrive.scopes");
const clientId = config.get("providers.googleDrive.clientId");
const clientSecret = config.get("providers.googleDrive.clientSecret");
const clientRedirectUri = config.get("providers.googleDrive.clientRedirectUri");

function normalizePhotoInfo(fileInfo, user) {
  return {
    owner: user,
    url: fileInfo.thumbnailLink,
    mimeType: fileInfo.mimeType,
    provider: "Google",
    providerId: fileInfo.id,
    original: fileInfo
  };
}

function isValidFile(file) {
  return validPhotos.indexOf(file.mimeType) > -1;
}

function getClient() {
  return new auth.OAuth2(clientId, clientSecret, clientRedirectUri);
}

function getAuthUrl() {
  return getClient().generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: clientRedirectUri
  });
}

module.exports = {
  getClient,
  isValidFile,
  normalizePhotoInfo,
  getAuthUrl
};
