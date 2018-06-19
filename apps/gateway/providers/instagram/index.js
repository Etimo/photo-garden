const express = require("express");
const logger = require("logging");
const router = express.Router();
const authController = require("./controllers/authController");
const subscriptionController = require("./controllers/subscriptionController");
const config = require("config");

console.log(config.get("providers.instagram.clientSecret"));
// Don't start unless config has been set
if (
  !config.hasAll([
    "providers.instagram.clientId",
    "providers.instagram.clientSecret"
  ])
) {
  logger.error("Missing config keys for instagram provider");
  process.exit(1);
}

// Routes for authorization flow
router.get("/auth/start", authController.authStart);
router.get("/auth/finish", authController.authFinish);

// Routes for subscription flow
// router.get("/subscription/start", subscriptionController.subscriptionStart);
// router.get("/subscription/stop", subscriptionController.subscriptionStop);
// router.get("/subscription/data", subscriptionController.subscriptionData);

module.exports = router;
