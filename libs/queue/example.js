const queue = require("./");
const logger = require("logging").logger;

async function main() {
  await queue.publishMessage("Hello", "World");
  await queue.onMessage("Hello", function(msg) {
    logger.info("MSG: ", JSON.parse(msg.toString()));
    return true;
  });
  await queue.onNotification("event.*", function(msg) {
    logger.info("Notification: ", JSON.parse(msg));
    return true;
  });
  await queue.onNotification("#", function(msg) {
    logger.info("(ALL) Notification: ", JSON.parse(msg));
    return true;
  });
  await queue.publishNotification("event.a", "Event A");
  await queue.publishNotification("event.b", "Event B");
  await queue.publishNotification("other", "Other event");
  await setTimeout(() => {
    queue.close();
  }, 1000);
}

main();
