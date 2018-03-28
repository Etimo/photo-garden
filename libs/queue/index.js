var amqp = require('amqplib');

const host = "localhost";
const port = 5672;

var connectionString = `amqp://${host}:${port}`;
var channel = null;
var timeout = 2000;
var conn;

async function connect() {
  console.log(`Connecting to rmq at ${connectionString}...`);
  conn = await amqp.connect(connectionString);
  channel = await conn.createChannel();
  console.log("Connected to rmq!");
}

async function onMessage(name, callback) {
  if (!channel) {
    await connect();
  }
  if (channel) {
    console.log("Consume msg");
    await channel.assertQueue(name, {durable: false});
    return channel.consume(name, function(msg) {
      if (msg !== null) {
        channel.ack(msg);
        callback(msg.content);
      }
    });
  }
}

async function publishMessage(name, message) {
  if (!channel) {
    await connect();
    console.log("Connected");
  }
  if (channel) {
    await channel.assertQueue(name, {durable: false});
    return channel.sendToQueue(name, new Buffer(JSON.stringify(message)));
  }
}

module.exports = {
  onMessage,
  publishMessage,
};

async function main() {
  await publishMessage("Hello", "World");
  await onMessage("Hello", function(msg) {
    console.log("MSG: ", JSON.parse(msg.toString()));
    return true;
  });
  await conn.close();
}

main();
