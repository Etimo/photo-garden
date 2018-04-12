# communication

Queue and notification handling for all apps. Use this module to publish something to a queue, consume a queue, publish a notification using pubsub or receive a notification using pubsub.

No need to create any queues or connect. Everything is handled automatically when requested.

```javascript
const communication = require("communication");

// Communication module contains both pubsub and queue functionality
const pubsub = communication.pubsub;
const queue = communication.queue;

// Publish to queue
await queue.publish("Hello", "World");

// Consume queue
await queue.consume("Hello", msg => {
  logger.info("Message from queue 'Hello': ", JSON.parse(msg.toString()));
  return true;
});

// Subscribe to events
await pubsub.subscribe("event.*", (msg, fields) => {
  logger.info("Notification from event.*: ", JSON.parse(msg), fields);
  return true;
});
await pubsub.subscribe("#", msg => {
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
```
