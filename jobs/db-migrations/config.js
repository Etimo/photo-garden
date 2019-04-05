const path = require("path");

const config = require("config");
const configName = "garden";
const configPrefix = `databases.${configName}`;

module.exports = {
  migrationDirectory: path.join(__dirname, "migrations"),
  driver: "pg",
  host: config.get(`${configPrefix}.host`),
  port: config.get(`${configPrefix}.port`),
  database: config.get(`${configPrefix}.database`),
  username: config.get(`${configPrefix}.user`),
  password: config.get(`${configPrefix}.password`),
  ssl: config.get(`${configPrefix}.ssl.enable`)
    ? {
        // TODO: enforce TLS certificates somehow?
        rejectUnauthorized: false
      }
    : null
};
