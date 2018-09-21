#!/usr/bin/env node
// Based on https://github.com/MattiLehtinen/postgrator-cli/blob/master/index.js, but patched to apply the Photo Garden config

const config = require("config");
const configName = "garden";
const configPrefix = `databases.${configName}`;
const configOptionNames = {
  host: "host",
  port: "port",
  database: "database",
  username: "user",
  password: "password"
};

const path = require("path");

const commandLineArgs = require("command-line-args");
const postgratorCli = require("postgrator-cli/postgrator-cli");
const commandLineOptions = require("postgrator-cli/command-line-options");

const optionList = commandLineOptions.optionList; // eslint-disable-line prefer-destructuring

const options = commandLineArgs(optionList);
options["migration-directory"] = path.join(__dirname, "migrations");
for (const optionName in configOptionNames) {
  const configOptionName = configOptionNames[optionName];
  options[optionName] = config.get(`${configPrefix}.${configOptionName}`);
  console.log({ optionName, value: options[optionName] });
}

postgratorCli.run(options, err => {
  if (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
});
