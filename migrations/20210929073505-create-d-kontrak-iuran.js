'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DKontrakIurans', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HKontrakKaryawanId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      IndexIuranId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      total: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('DKontrakIurans');
  }
};