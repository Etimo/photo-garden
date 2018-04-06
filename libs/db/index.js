const { Pool: PgPool } = require("pg");
const config = require("config");

function create() {
  return new PgPool({
    user: config.get("db.user"),
    host: config.get("db.host"),
    database: config.get("db.database"),
    password: config.get("db.password"),
    port: config.get("db.port")
  });
}

module.exports = {
  create
};
