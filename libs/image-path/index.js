const mkdir = require("mkdir-recursive");
const config = require("config");
const path = require("path");
const destPath = config.get("images.path");

const photoServerBaseUrl = config.get("urls.photoServer");

const imageType = {
  small: "small",
  large: "large"
};

function assertPath(userId, providerName, providerId, extension) {
  console.log(
    "Create path",
    path.join(destPath, getPath(userId, providerName))
  );
  mkdir.mkdirSync(path.join(destPath, getPath(userId, providerName)));
}

function getFilename(providerId, extension, imageType) {
  return `${providerId}${imageType}.${extension.toLowerCase()}`;
}

function getPath(userId, providerName, providerId, extension) {
  return `${userId}/${providerName}`;
}

function getPathAndFile(
  userId,
  providerName,
  providerId,
  extension,
  imageType
) {
  return `${getPath(userId, providerName, providerId, extension)}/${getFilename(
    providerId,
    extension,
    imageType
  )}`;
}

function getFullPathAndFile(userId, providerName, providerId, extension) {
  return path.join(
    destPath,
    getPathAndFile(userId, providerName, providerId, extension)
  );
}

function getUrl(userId, providerName, providerId, extension, imageType) {
  return `${photoServerBaseUrl}/${getPathAndFile(
    userId,
    providerName,
    providerId,
    extension,
    imageType
  )}`;
}

module.exports = {
  imageType,
  assertPath,
  getFilename,
  getFullPathAndFile,
  getPathAndFile,
  getPath,
  getUrl
};
