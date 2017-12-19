"use strict";

const unleash = require("unleash-client");

function isEnabled(featureName) {
  const result = unleash.isEnabled(featureName);

  return result;
}

module.exports = {
  isEnabled
};
