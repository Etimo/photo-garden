var express = require("express");
var router = express.Router();
var authController = require("./controllers/authController");
var config = require("../config");
var util = require("./lib/util");

// Don't start unless config has been set
util.assertConfig(config, ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CLIENT_REDIRECT_URI"]);

router.get("/auth/start", authController.authStart);
router.get("/auth/finish", authController.authFinish);

module.exports = router;
