"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const addColumnPhotoProvider = function() {
      return queryInterface.addColumn("photos", "photo_provider", {
        type: Sequelize.ENUM,
        values: ["Google"],
        allowNull: false
      });
    };

    const addColumnOriginal = function() {
      return queryInterface.addColumn("photos", "original", {
        type: Sequelize.JSONB,
        allowNull: false
      });
    };

    return addColumnPhotoProvider().then(addColumnOriginal);

    //return queryInterface
    //  .addColumn("photos", "photo_provider", {
    //    type: Sequelize.ENUM,
    //    values: ["Google"],
    //    allowNull: false
    //  })
    //  .then(function() {
    //    return queryInterface.addColumn("photos", "original", {
    //      type: Sequelize.JSONB,
    //      allowNull: false
    //    });
    //  });
  },

  down: (queryInterface, Sequelize) => {
    const origin = function() {
      return queryInterface.removeColumn("photos", "original");
    };
    const photo_provider = function() {
      return queryInterface.removeColumn("photos", "photo_provider");
    };

    return origin().then(photo_provider);
  }
};
