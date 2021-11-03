'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HKontrakKaryawans', {
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
      idHRD: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      jenisKontrak: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      totalGaji: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalIuran: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      tanggalMulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      tanggalBerakhir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true,
      },
      status: {
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
    await queryInterface.dropTable('HKontrakKaryawans');
  }
};