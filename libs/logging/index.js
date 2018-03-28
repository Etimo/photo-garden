const winston = require("winston");
const logzioWinstonTransport = require('winston-logzio');
const moment = require("moment");
const path = require("path");

const argvs = process.argv[1].split(path.sep);
const appName = argvs[argvs.length - 2];


const config = winston.config;
const loggerOptions = {
    token: process.env.LOGZ_TOKEN,
    host: 'listener.logz.io',
    type: appName
};
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: process.env.LOG_LEVEL || 'info',
      timestamp: function() {
        return moment.utc().format("YYYY-MM-DD HH:mm:ss,SSS");
      },
      formatter: function(options) {
        const res = [
        	options.timestamp(),
          " [",
        	config.colorize(options.level, options.level.toUpperCase().padEnd(8)),
          "] (",
          appName,
          ") - "
        ];
        if (options.message) {
        	res.push(options.message);
        }
        if (options.meta && Object.keys(options.meta).length > 0) {
        	res.push(" - ");
        	res.push(JSON.stringify(options.meta));
        }
        return res.join("");
      }
    }),
    new (logzioWinstonTransport)(loggerOptions)
  ]
});

logger.info("Logging initialized");

module.exports = {
	logger
}