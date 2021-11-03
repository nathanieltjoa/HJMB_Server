'use strict';

const { DataTypes } = require("sequelize/types");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Jabatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      namaJabatan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jabatanKu: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tingkatJabatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Jabatans');
  }
};