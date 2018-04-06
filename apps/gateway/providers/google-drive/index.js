var express = require("express");
const logger = require("logging");
var router = express.Router();
var authController = require("./controllers/authController");
var subscriptionController = require("./controllers/subscriptionController");
var config = require("config");
var util = require("./lib/util");

// Don't start unless config has been set
if (
  !config.hasAll([
    "providers.googleDrive.clientId",
    "providers.googleDrive.clientSecret",
    "providers.googleDrive.clientRedirectUri"
  ])
) {
  logger.error("Missing config keys");
  process.exit(1);
}

// Routes for authorization flow
router.get("/auth/start", authController.authStart);
router.get("/auth/finish", authController.authFinish);

// Routes for subscription flow
router.get("/subscription/start", subscriptionController.subscriptionStart);
router.get("/subscription/stop", subscriptionController.subscriptionStop);
router.get("/subscription/data", subscriptionController.subscriptionData);

module.exports = router;
