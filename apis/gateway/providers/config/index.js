var defaults = require("./default.js");
var currentEnv = process.env.NODE_ENV || "development";
var config = require("./" + currentEnv + ".js");

module.exports = Object.assign({}, defaults, config);
