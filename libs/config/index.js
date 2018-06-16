const fs = require("fs");
const changeCase = require("change-case");
const logger = require("logging");

const currentEnv = process.env.NODE_ENV || "development";
const filename =
  process.env.PHOTO_GARDEN_CONFIG ||
  `${__dirname}/../../` + `config.${currentEnv}.json`;
const buffer = fs.existsSync(filename) ? fs.readFileSync(filename) : "{}";
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
  logger.silly("Config key", key, "got value", curr);
  if (typeof curr === "undefined") {
    // Not found in config file, try env
    key = `PHOTO_GARDEN_${changeCase.constant(key)}`;
    logger.debug("Falling back to env for key", key);
    return process.env[key];
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
