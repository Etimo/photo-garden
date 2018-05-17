const express = require("express");
const logger = require("logging");
const router = express.Router();
const config = require("config");
const url = require('url');
const dbClient = require("db").create("garden");
const users = require("provider-user");
const https = require('https');
const authController = require("./controllers/authController");

// Don't start unless config has been set
if (
    !config.hasAll([
        'providers.dropbox.clientId',
    ])
) {
    logger.error('Missing dropbox config keys');
    process.exit(1);
}
// Routes for authorization flow
router.get('/auth/start', authController.start);

router.get('/auth/finish', authController.redirect);

router.get('/auth/finish2', (req, res) => {
    

});


module.exports = router;
