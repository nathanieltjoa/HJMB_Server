'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DPinjamUangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      HPinjamUangId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      totalPembayaran: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      pembayaranKe: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      lunas: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DPinjamUangs');
  }
};