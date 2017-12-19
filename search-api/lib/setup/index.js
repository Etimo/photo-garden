"use strict";

const morgan = require("morgan");
const unleash = require("./unleash");

function init(app) {
  unleash.init();
  app.use(morgan("combined"));
}

module.exports = {
  init
};
