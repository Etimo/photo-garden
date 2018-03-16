var amqp = require('amqplib/callback_api');
var config = require("../../config");

var connectionString = `amqp://${config.QUEUE_HOST}:${config.QUEUE_PORT}`;
var channel;
var queueName = "image-import";

function connect() {
  console.log(`Connecting to rmq at ${connectionString}...`);
  amqp.connect(connectionString, function(err, conn) {
    if (err) {
      console.log("queue error", err);
      console.log("Trying to reconnect...");
      setTimeout(connect, 2000);
      return;
    }
    console.log("Connected to rmq!");
    conn.createChannel(function(err, ch) {
      ch.assertQueue(queueName, {durable: false});
      channel = ch;
      // ch.sendToQueue(q, new Buffer('Hello World!'));
      // console.log(" [x] Sent 'Hello World!'");
      // ch.consume(q, function(msg) {
      //   if (msg !== null) {
      //     console.log("Rec msg", msg.content.toString());
      //     ch.ack(msg);
      //   }
      // });
    });
  });
}
connect();

function publish(data) {
  if (channel) {
    channel.sendToQueue(queueName, new Buffer(JSON.stringify(data)));
    console.log("Publishing message to queue", queueName, data.id);
  }
}

module.exports = {
  publish
};
