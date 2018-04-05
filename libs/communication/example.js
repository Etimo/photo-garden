const communication = require("./");
const logger = require("logging");

async function main() {
  // Communication module contains both pubsub and queue functionality
  const pubsub = communication.pubsub;
  const queue = communication.queue;

  // Publish to queue
  await queue.publish("Hello", "World");

  // Consume queue
  await queue.consume("Hello", function(msg) {
    logger.info("Message from queue 'Hello': ", JSON.parse(msg.toString()));
    return true;
  });

  // Subscribe to events
  await pubsub.subscribe("event.*", function(msg, fields) {
    logger.info("Notification from event.*: ", JSON.parse(msg), fields);
    return true;
  });
  await pubsub.subscribe("#", function(msg) {
    logger.info("(Catch-all) Notification: ", JSON.parse(msg));
    return true;
  });

  // Publish events
  await pubsub.publish("event.a", "Event A"); // Will notify event.* and catch-all
  await pubsub.publish("event.b", "Event B"); // Will notify event.* and catch-all
  await pubsub.publish("other", "Other event"); // Will only notify catch-all

  // Close after a while
  await setTimeout(() => {
    communication.close();
  }, 1000);
}

// Run
main();
