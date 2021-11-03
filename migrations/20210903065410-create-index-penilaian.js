'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('IndexPenilaians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      namaIndex: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nilaiIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      keteranganIndex: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
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
    await queryInterface.dropTable('IndexPenilaians');
  }
};