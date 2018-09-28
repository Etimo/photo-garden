const communication = require("./");
const logger = require("logging");

// Start publishing every second to two different channels
setInterval(_ => {
  communication.publish("foo", { hello: "foo", rnd: Math.random() });
  communication.publish("bar", { hello: "bar", rnd: Math.random() });
}, 3000);

// Subscribe too foo channel and consume all events on every startup
communication.subscribe(
  {
    channel: "foo",
    sequence: "earliest",
    clientId: "client-1"
  },
  msg => {
    logger.info("client-1 (subscription 1, all) received: ", msg);
  }
);

// You can also ack messages asynchronously (useful for async jobs that might fail)
communication.subscribe(
  {
    channel: "foo",
    clientId: "client-1",
    ackTimeoutMillis: 2 * 1000
  },
  msg =>
    new Promise(resolve => {
      setTimeout(resolve, 1000);
    })
);

// Subscribe too foo channel and start with the latest value
communication.subscribe(
  {
    channel: "bar",
    clientId: "client-1"
  },
  msg => {
    logger.info("client-1 (subscription 2, from latest) received: ", msg);
  }
);

// Subscribe too foo channel and continue where left off
// Durable name identifier is used by server to keep track of what we have received and not
communication.subscribe(
  {
    channel: "foo",
    durableName: "im-durable",
    clientId: "client-1"
  },
  msg => {
    logger.info("client-1 (subscription 3, durable) received: ", msg);
  }
);
