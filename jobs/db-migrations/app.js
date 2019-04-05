#!/usr/bin/env node
// Based on https://github.com/MattiLehtinen/postgrator-cli/blob/master/index.js, but patched to apply the Photo Garden config

const path = require("path");

const commandLineArgs = require("command-line-args");
const postgratorCli = require("postgrator-cli/postgrator-cli");
const commandLineOptions = require("postgrator-cli/command-line-options");

const optionList = commandLineOptions.optionList; // eslint-disable-line prefer-destructuring
const options = commandLineArgs(optionList);
options.config = path.join(__dirname, "config.js");

postgratorCli.run(options, err => {
  if (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
});
