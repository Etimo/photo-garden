const amqp = require("amqplib");
const logger = require("logging").logger;
const config = require("config");

const host = config.get("queue.host");
const port = config.get("queue.port");

var connectionString = `amqp://${host}:${port}`;
var channel = null;
var timeout = 2000;
var conn;

async function connect() {
  logger.info(`Connecting to rmq at ${connectionString}...`);
  conn = await amqp.connect(connectionString);
  channel = await conn.createChannel();
  logger.info("Connected to rmq!");
}

async function onMessage(name, callback) {
  if (!channel) {
    await connect();
  }
  if (channel) {
    logger.info(`Consume messages from ${name}`);
    await channel.assertQueue(name, { durable: false });
    return channel.consume(name, function(msg) {
      if (msg !== null) {
        logger.debug(`Message received on ${name}: ${msg.content}`);
        channel.ack(msg);
        callback(msg.content);
      }
    });
  }
}

async function publishMessage(name, message) {
  if (!channel) {
    await connect();
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
    await connect();
  }
  if (channel) {
    const exchangeName = `pubsub-${name}`;
    const msg = JSON.stringify(message);
    await channel.assertExchange(exchangeName, "fanout", { durable: false });
    logger.debug(`Notify to ${name}: ${msg}`);
    return channel.publish(exchangeName, "", new Buffer(msg));
  }
}

async function onNotification(name, callback) {
  if (!channel) {
    await connect();
  }
  if (channel) {
    const exchangeName = `pubsub-${name}`;
    const queue = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(queue.queue, exchangeName, "");
    return channel.consume(
      queue.queue,
      function(msg) {
        if (msg !== null) {
          logger.debug(`Notification received on ${name}: ${msg.content}`);
          callback(msg.content);
        }
      },
      { noAck: true }
    );
  }
}

module.exports = {
  onMessage,
  onNotification,
  publishMessage,
  publishNotification
};

async function main() {
  await publishMessage("Hello", "World");
  await onMessage("Hello", function(msg) {
    console.log("MSG: ", JSON.parse(msg.toString()));
    return true;
  });
  await publishNotification("Hello", "World");
  await onNotification("Hello", function(msg) {
    console.log("Notification: ", JSON.parse(msg.toString()));
    return true;
  });
  await conn.close();
}

main();
