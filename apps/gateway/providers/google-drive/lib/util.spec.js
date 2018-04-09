/* global it, describe, before */
"use strict";
const chai = require("chai");
const expect = chai.expect;
const util = require("./util");

describe("util", () => {
  before(() => {});

  describe("isValidImage", () => {
    it("should accept files of type jpeg", () => {
      expect(util.isValidFile({ mimeType: "image/jpeg" })).to.be.true;
    });

    it("should not accept files of type png", () => {
      expect(util.isValidFile({ mimeType: "image/png" })).to.be.false;
    });
  });

  describe("hasRequiredKeys", () => {
    it("should return false if key is missing in set", () => {
      expect(util.hasRequiredKeys({}, ["KEY"])).to.be.false;
    });

    it("should return true if key exists in set", () => {
      expect(util.hasRequiredKeys({ KEY: "value" }, ["KEY"])).to.be.true;
    });
  });
});
