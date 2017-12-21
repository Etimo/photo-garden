"use strict";
var chai = require('chai');
var expect = chai.expect;
var util = require('./util');

describe("util", () => {
  describe("isValidImage", () => {
    it("should accept files of type jpeg", () => {
      expect(util.isValidFile({mimeType: "image/jpeg"})).to.be.true;
    });

    it("should not accept files of type png", () => {
      expect(util.isValidFile({mimeType: "image/png"})).to.be.false;
    });
  });
});
