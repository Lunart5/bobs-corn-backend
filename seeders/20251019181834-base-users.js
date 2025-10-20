"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash("password123", 12);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin",
          email: "admin@admin.com",
          password: hashedPassword,
          address: "Vice City",
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Test User",
          email: "test@admin.com",
          password: hashedPassword,
          address: "Liberty City",
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: {
          [Sequelize.Op.in]: ["admin@admin.com", "user@admin.com"],
        },
      },
      {},
    );
  },
};
