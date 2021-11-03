'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Absensis', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      idKaryawan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      JamKerjaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      scanMasuk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      scanPulang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      terlambat: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamBolos: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      absen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      lembur: {
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
    await queryInterface.dropTable('Absensis');
  }
};