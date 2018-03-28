const fs = require("fs");

const buffer = fs.readFileSync(__dirname + "/../../config.json");
const config = JSON.parse(buffer);

const get = key => {
  let curr = null;
  key.split(".").forEach(s => {
    if (curr) {
      curr = curr[s];
    } else {
      curr = config[s];
    }
  });
  if (typeof curr === "undefined") {
    // Not found in config file, try env
    key = "PHOTO_GARDEN_" + key.toUpperCase().replace(/[^A-Z0-9]/g, "_");
    console.log(key);
  }
  return curr;
};

const has = key => {
  return typeof get(key) !== "undefined";
};

const hasAll = keys => {
  return keys.every(has);
};

module.exports = {
  get,
  has,
  hasAll
};
