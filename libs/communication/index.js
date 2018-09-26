const amqp = require("amqplib");
const retry = require("async-retry");
const logger = require("logging");
const config = require("config");
const stan = require("node-nats-streaming");
const uuid = require("uuid/v1");

const host = config.get("queue.host");
const port = config.get("queue.port");
const token = config.get("queue.token");

const connectionString = `nats://${host}:${port}`;
let channel = null;
const timeout = 2000;
let connecting = false;
let connected = false;
let conn;

function generateRandomId() {
  return `client-${uuid()}`;
}

function connect(clusterName, clientId) {
  connecting = true;
  clusterName = clusterName || "test-cluster";
  if (!clientId) {
    throw new Error("Missing client id for nats connection");
  }
  clientId = `${clientId}-${generateRandomId()}`;
  logger.info(`Connecting to nats on ${connectionString} as ${clientId}`);
  conn = stan.connect(
    clusterName,
    clientId,
    {
      maxReconnectAttempts: -1,
      url: connectionString,
      token: token,
      waitOnFirstConnect: true
    }
  );
  conn.on("connect", () => {
    logger.info("Connected to nats");
    conn.on("close", function() {
      process.exit();
    });
    connected = true;
  });
  conn.on("error", err => {
    logger.error("Nats connection error", err);
  });
  conn.on("disconnect", () => {
    logger.error("Nats disconnected");
  });
}

function connectionPromiseCallback(resolve, reject) {
  if (!connected) {
    setTimeout(_ => {
      connectionPromiseCallback(resolve, reject);
    }, 1000);
  } else {
    process.on("SIGINT", () => {
      logger.info("SIGINT captured, disconnecting from nats");
      conn.close();
    });
    resolve();
  }
}

const waitForConnection = new Promise(connectionPromiseCallback);

const waitForReadyConnection = new Promise((resolve, reject) => {
  logger.debug("Waiting for connection to nats");
  waitForConnection.then(_ => {
    resolve();
  });
});

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
  if (!conn && !connecting) {
    connect(
      options.clusterName,
      options.clientId
    );
  }
}

function subscribe(options, callback) {
  connectIfNeeded(options);
  waitForReadyConnection.then(_ => {
    logger.info(`Setup subscription to ${options.channel}`);
    const opts = conn.subscriptionOptions();
    setDeliveryType(opts, options.sequence);
    if (options.hasOwnProperty("durableName")) {
      opts.setDeliverAllAvailable();
      opts.setDurableName(options.durableName);
    }

    const subscription = conn.subscribe(
      options.channel,
      options.queueGroup,
      opts
    );
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
  waitForReadyConnection.then(_ => {
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
