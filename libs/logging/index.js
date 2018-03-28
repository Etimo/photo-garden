const winston = require("winston");
const moment = require("moment");

const config = winston.config;
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
        	config.colorize(options.level, options.level.toUpperCase().padEnd(8)),
        ];
        if (options.message) {
        	res.push(options.message);
        }
        if (options.meta && Object.keys(options.meta).length > 0) {
        	res.push(" - ");
        	res.push(JSON.stringify(options.meta));
        }
        return res.join(" ");
      }
    })
  ]
});

logger.info("Logging initialized");

module.exports = {
	logger
}