"use strict";

const config = require("../config");
const uuid = require("uuid");
const name = require("../../package").name;
const { initialize } = require("unleash-client");

function init() {

  initialize({
    url: config.unleashUrl,
    appName: `photo-garden-${name}`,
    instanceId: uuid.v4()
  });

  // optional events
  // instance.on("error", console.error);
  // instance.on("warn", console.warn);
  // instance.on("ready", console.log);
  // metrics hooks
  // instance.on("registered", clientData => console.log("registered", clientData));
  // instance.on("sent", payload => console.log("metrics bucket/payload sent", payload));
  // instance.on("count", (name, enabled) => console.log(`isEnabled(${name}) returned ${enabled}`));
}

module.exports = {
  init
};
