const amqp = require("amqplib");
const retry = require("async-retry");
const logger = require("logging");
const config = require("config");

const host = config.get("queue.host");
const port = config.get("queue.port");

var connectionString = `amqp://${host}:${port}`;
var channel = null;
var timeout = 2000;
var conn;

async function connect() {
  await retry(
    async (bail, attempt) => {
      logger.info(
        `Connecting to rmq at ${connectionString} (attempt ${attempt})...`
      );
      conn = await amqp.connect(connectionString);
      channel = await conn.createChannel();
      logger.info("Connected to rmq!");
      return conn;
    },
    {
      minTimeout: 2000,
      retries: 10,
      onRetry: err => {
        logger.warn("Unable to connect to rmq, retrying...");
      }
    }
  );
}

/**
 * @param name {string} The name of the queue to consume.
 * @param callback {Function} A callback function to invoke for each received message.
 * @return {[type]}
 */
async function onMessage(name, callback) {
  if (!channel) {
    // Defer publish
    setTimeout(_ => {
      onMessage(name, callback)
    }, 1000);
  }
  if (channel) {
    logger.info(`Consume messages from ${name}`);
    await channel.assertQueue(name, { durable: false });
    return channel.consume(name, function(msg) {
      if (msg !== null) {
        logger.debug(`Message received on ${name}: ${msg.content}`);
        callback(msg, channel);
      }
    });
  }
}

async function publishMessage(name, message) {
  if (!channel) {
    // Defer publish
    setTimeout(_ => {
      publishMessage(name, message)
    }, 1000);
  }
  if (channel) {
    const msg = JSON.stringify(message);
    logger.debug(`Publish message to ${name}: ${msg}`);
    await channel.assertQueue(name, { durable: false });
    return channel.sendToQueue(name, new Buffer(msg));
  }
}

async function publishNotification(name, message) {
  if (!channel) {
    // Defer publish
    setTimeout(_ => {
      publishNotification(name, message)
    }, 1000);
  }
  if (channel) {
    const exchangeName = `pubsub`;
    const msg = JSON.stringify(message);
    await channel.assertExchange(exchangeName, "topic", { durable: false });
    logger.debug(`Notify to ${name}: ${msg}`);
    return channel.publish(exchangeName, name, new Buffer(msg));
  }
}

async function onNotification(name, callback) {
  if (!channel) {
    // Defer publish
    setTimeout(_ => {
      onNotification(name, callback)
    }, 1000);
  }
  if (channel) {
    const exchangeName = `pubsub`;
    const queue = await channel.assertQueue("", { exclusive: true });
    await channel.assertExchange(exchangeName, "topic", { durable: false });
    await channel.bindQueue(queue.queue, exchangeName, name);
    return channel.consume(
      queue.queue,
      function(msg) {
        if (msg !== null) {
          logger.debug(`Notification received on ${name}:`, msg);
          callback(msg.content, msg.fields);
        }
      },
      { noAck: true }
    );
  }
}

/**
 * Close the open connection.
 * @return null
 */
async function close() {
  return await conn.close();
}

connect();

const pubsub = {
  publish: publishNotification,
  subscribe: onNotification
};

const queue = {
  publish: publishMessage,
  consume: onMessage
};

module.exports = {
  pubsub,
  queue,
  close
};
