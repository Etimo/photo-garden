const { Pool: PgPool } = require("pg");
const config = require("config");

function create(name) {
  const prefix = `databases.${name}`;
  return new PgPool({
    user: config.get(`${prefix}.user`),
    host: config.get(`${prefix}.host`),
    database: config.get(`${prefix}.database`),
    password: config.get(`${prefix}.password`),
    port: config.get(`${prefix}.port`),
    ssl: config.get(`${prefix}.ssl.enable`)
      ? {
          // TODO: enforce TLS certificates somehow?
          rejectUnauthorized: false
        }
      : null
  });
}

module.exports = {
  create
};
