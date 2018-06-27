const communication = require("communication");
const logger = require("logging");

const state = {};

function flagId(id, status) {
  if (!(id in state)) {
    state[id] = {}
  }
  state[id][status] = true;
  if (Object.keys(state[id]).length === 2) {
    // Done
    logger.info("INDEXED", id)
    communication.publish("user-photo--indexed", {id})
    delete state[id]
  }
  // logger.info(`Index size: ${Object.keys(state).length}`);
}

communication.subscribe({
  channel: "user-photo--downloaded",
  durableName: "user-photo--downloaded",
  clientId: "user-photo--wait-indexed"
}, msg => {
  const message = JSON.parse(msg.data);
  // console.log("WAIT1", message);
  const id = message.id;
  flagId(id, "downloaded");
});

communication.subscribe({
  channel: "user-photo--imported",
  durableName: "user-photo--imported",
  clientId: "user-photo--wait-indexed"
}, msg => {
  const message = JSON.parse(msg.data);
  // console.log("WAIT2", message);
  const id = message.providerId;
  flagId(id, "imported");
});

