const path = require("path");

const argvs = process.argv[1].split(path.sep);
const appName = process.env.APP_NAME || argvs[argvs.length - 2];

module.exports = appName;
