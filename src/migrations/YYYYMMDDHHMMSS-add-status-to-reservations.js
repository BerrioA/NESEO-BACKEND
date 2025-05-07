"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Reservations", "completed", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Reservations", "status", {
      type: Sequelize.ENUM("pending", "in_progress", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Reservations", "completed");
    await queryInterface.removeColumn("Reservations", "status");
  },
};
