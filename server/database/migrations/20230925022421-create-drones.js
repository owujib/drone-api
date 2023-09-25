'use strict';

const { randomUUID } = require('crypto');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Drones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      serial_number: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        defaultValue: () => randomUUID(),
      },
      model: {
        type: Sequelize.ENUM(
          'Lightweight',
          'Middleweight',
          'Cruiserweight',
          'Heavyweight',
        ),
      },
      weight_limit: {
        type: Sequelize.STRING,
      },
      battery_capacity: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.ENUM(
          'IDLE',
          'LOADING',
          'LOADED',
          'DELIVERING',
          'DELIVERED',
          'RETURNING',
        ),
        defaultValue: 'IDLE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Drones');
  },
};
