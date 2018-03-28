const amqp = require("amqplib");

const model = require("./model.js");

const connectionString = "amqp://queue:5672";
const queueName = "image-import";

async function addImage(msg, channel) {
  try {
    const image = JSON.parse(msg.content);
    const id = await model.insert(image);
    await channel.ack(msg);
    if (id !== undefined) {
      console.log(`Imported image as ${id}`);
    }
  } catch (err) {
    await channel.nack(msg);
    console.log(`Failed to import image: ${err}, returning to the queue...`);
  }
}

async function connect() {
  console.log(`Connecting to rmq at ${connectionString}...`);
  let conn;
  try {
    conn = await amqp.connect(connectionString);
  } catch (err) {
    console.log("queue error", err);
    console.log("Trying to reconnect...");
    setTimeout(connect, 2000);
    return;
  }
  console.log("Connected to rmq!");
  const ch = await conn.createChannel();
  ch.assertQueue(queueName, { durable: false });
  ch.consume(queueName, msg => addImage(msg, ch), {
    consumerTag: "photos-api"
  });
}

module.exports = {
  start: connect
};
