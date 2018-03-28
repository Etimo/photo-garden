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
  return Promise.resolve(conn);
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
    const exchangeName = `pubsub`;
    const msg = JSON.stringify(message);
    await channel.assertExchange(exchangeName, "topic", { durable: false });
    logger.debug(`Notify to ${name}: ${msg}`);
    return channel.publish(exchangeName, name, new Buffer(msg));
  }
}

async function onNotification(name, callback) {
  if (!channel) {
    await connect();
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
          logger.debug(`Notification received on ${name}: ${msg}`);
          callback(msg.content, msg.fields);
        }
      },
      { noAck: true }
    );
  }
}

async function close() {
  await conn.close();
}

module.exports = {
  onMessage,
  onNotification,
  publishMessage,
  publishNotification,
  close
};
