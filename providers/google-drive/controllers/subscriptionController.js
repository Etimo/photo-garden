var scopes = ["https://www.googleapis.com/auth/drive.readonly"];
var util = require("../lib/util");
var filesWorker = require("../workers/subscription");
var config = require("../../config");

exports.subscriptionStart = (req, res) => {};

exports.subscriptionStop = (req, res) => {};

exports.subscriptionData = (req, res) => {};