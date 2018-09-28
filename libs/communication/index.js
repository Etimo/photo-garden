const amqp = require("amqplib");
const retry = require("async-retry");
const logger = require("logging");
const config = require("config");
const stan = require("node-nats-streaming");
const uuid = require("uuid/v1");
const appName = require("app-name");

const host = config.get("queue.host");
const port = config.get("queue.port");
const token = config.get("queue.token");

const connectionString = `nats://${host}:${port}`;
let channel = null;

let connection;

function generateRandomId() {
  return `client-${uuid()}`;
}

function connect(clusterName, clientId) {
  return new Promise((resolve, reject) => {
    if (!clientId) {
      throw new Error("Missing client id for nats connection");
    }
    clusterName = clusterName || "test-cluster";
    clientId = `${clientId}-${generateRandomId()}`;
    logger.info(`Connecting to nats on ${connectionString} as ${clientId}`);
    const conn = stan.connect(
      clusterName,
      clientId,
      {
        reconnect: false,
        maxReconnectAttempts: 2,
        url: connectionString,
        token: token,
        waitOnFirstConnect: true
      }
    );
    conn.on("connect", () => {
      logger.info("Connected to nats");
      conn.on("close", () => {
        logger.error("Nats closed");
        process.exit();
      });
      resolve(conn);
    });
    conn.on("error", reject);
    conn.on("disconnect", () => {
      logger.error("Nats disconnected");
      process.exit(2);
    });
  });
}

function setDeliveryType(natsOptions, sequence) {
  if (typeof sequence === "number") {
    // Explicit sequence
    natsOptions.setStartAtSequence(sequence);
  } else if (typeof sequence === "string") {
    switch (sequence) {
      case "earliest":
        natsOptions.setDeliverAllAvailable();
        break;
      default:
        natsOptions.setStartWithLastReceived();
        break;
    }
  }
}

function connectIfNeeded(options) {
  if (connection === undefined) {
    connection = connect(
      options.clusterName,
      options.clientId
    ).catch(err => {
      logger.error("Nats connection failed", err);
      process.exit(1);
    });
  }
  return connection;
}

function subscribe(options, callback) {
  connectIfNeeded(options).then(conn => {
    logger.info(`Setup subscription to ${options.channel}`);
    const opts = conn.subscriptionOptions();
    setDeliveryType(opts, options.sequence);
    if (options.hasOwnProperty("durableName")) {
      opts.setDeliverAllAvailable();
      opts.setDurableName(options.durableName);
    }

    const subscription = conn.subscribe(options.channel, appName, opts);
    subscription.on("message", msg => {
      logger.debug(
        `Received message ${msg.getSequence()} on ${options.channel}`
      );
      callback({
        sequence: msg.getSequence(),
        data: msg.getData(),
        timestamp: msg.getTimestamp()
      });
    });
  });
}

function publish(optionsOrChannel, message) {
  if (typeof optionsOrChannel !== "string") {
    connectIfNeeded(optionsOrChannel);
  }
  connection.then(conn => {
    const channel =
      typeof optionsOrChannel === "string"
        ? optionsOrChannel
        : optionsOrChannel.channel;
    logger.debug(`Publishing message to ${channel}`);
    conn.publish(channel, JSON.stringify(message), function(err, guid) {
      // if(err) {
      //   console.log('publish failed: ' + err);
      // } else {
      //   console.log('published message with guid: ' + guid);
      // }
    });
  });
}

function close() {}

module.exports = {
  connect: connectIfNeeded,
  publish,
  subscribe,
  close
};
