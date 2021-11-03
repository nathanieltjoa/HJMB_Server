'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HPinjamUangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idKaryawan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      jumlahPinjam: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      keteranganPinjam: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      lunas: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      cicilan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      diTerima: {
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
    await queryInterface.dropTable('HPinjamUangs');
  }
};