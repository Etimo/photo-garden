"use strict";

const express = require("express");
const app = express();
const setup = require("./lib/setup");

setup.init();

function respond(request, response) {
  const name = request.params.name || "Etimo";
  response.send(`Well, hello there ${name}!`);
}

app.get("/", (request, response) => {
  respond(request, response);
});
app.get("/:name", (request, response) => {
  respond(request, response);
});

app.listen(3000);

module.exports = app;
