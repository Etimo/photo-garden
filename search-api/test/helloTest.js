"use strict";

const app = require("../app");
const supertest = require("supertest");
const request = supertest.agent(app.listen());

Feature("Hello", () => {

  Scenario("Response with parameter", () => {

    let name, response;

    before((done) => {
      // just to illustrate before, this could be achieved in Given below as well
      // note that this is the callback approach, await is used below
      name = "ET";
      done();
    });

    Given("we have set a name", () => { });
    And("we send a request to hello", async () => {
      response = await request.get(`/${name}`);
    });
    Then("response status should be OK", () => {
      response.status.should.equal(200);
    });
    And("response should contain name", () => {
      response.text.should.equal(`Well, hello there ${name}!`);
    });
  });
});
