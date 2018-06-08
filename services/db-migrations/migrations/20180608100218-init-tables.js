"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("users", {
        id: {
          type: Sequelize.UUID,
          primaryKey: true
        },
        username: {
          type: Sequelize.TEXT,
          unique: true,
          allowNull: false
        }
      })
      .then(function() {
        return queryInterface
          .createTable("user_identities", {
            id: {
              type: Sequelize.UUID,
              primaryKey: true
            },
            user_id: {
              type: Sequelize.UUID,
              references: {
                model: "users",
                key: "id"
              },
              allowNull: false
            },
            provider: {
              type: Sequelize.ENUM,
              values: ["Google"],
              allowNull: false
            },
            provider_id: {
              type: Sequelize.TEXT,
              allowNull: false
            }
          })
          .then(function() {
            return queryInterface
              .addConstraint("user_identities", ["provider", "provider_id"], {
                type: "unique",
                name: "uc-provider-provider_id"
              })
              .then(function() {
                return queryInterface.createTable("photos", {
                  id: {
                    type: Sequelize.UUID,
                    primaryKey: true
                  },
                  owner: {
                    type: Sequelize.UUID,
                    references: {
                      model: "users",
                      key: "id"
                    },
                    allowNull: false
                  },
                  url: {
                    type: Sequelize.TEXT,
                    allowNull: false
                  },
                  mime_type: {
                    type: Sequelize.TEXT,
                    allowNull: false
                  }
                });
              });
          });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("photos").then(function() {
      return queryInterface.dropTable("user_identities").then(function() {
        return queryInterface.dropTable("users");
      });
    });
  }
};
