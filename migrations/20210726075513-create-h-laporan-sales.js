'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanSales', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idPelapor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKetua: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      laporanKejadian: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      keteranganKejadian: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      feedbackKaryawan: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('HLaporanSales');
  }
};