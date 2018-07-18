const mkdir = require("mkdir-recursive");
const config = require("config");
const path = require("path");
const destPath = config.get("images.path");

const photoServerBaseUrl = config.get("urls.photoServer");

function assertPath(userId, providerName, providerId, extension) {
  console.log(
    "Create path",
    path.join(destPath, getPath(userId, providerName))
  );
  mkdir.mkdirSync(path.join(destPath, getPath(userId, providerName)));
}

function getFilename(providerId, extension) {
  return `${providerId}.${extension.toLowerCase()}`;
}

function getPath(userId, providerName, providerId, extension) {
  return `${userId}/${providerName}`;
}

function getPathAndFile(userId, providerName, providerId, extension) {
  return `${getPath(userId, providerName, providerId, extension)}/${getFilename(
    providerId,
    extension
  )}`;
}

function getFullPathAndFile(userId, providerName, providerId, extension) {
  return path.join(
    destPath,
    `${getPath(userId, providerName, providerId, extension)}/${getFilename(
      providerId,
      extension
    )}`
  );
}

function getUrl(userId, providerName, providerId, extension) {
  return `${photoServerBaseUrl}/${getPathAndFile(
    userId,
    providerName,
    providerId,
    extension
  )}`;
}

module.exports = {
  assertPath,
  getFilename,
  getFullPathAndFile,
  getPathAndFile,
  getPath,
  getUrl
};
