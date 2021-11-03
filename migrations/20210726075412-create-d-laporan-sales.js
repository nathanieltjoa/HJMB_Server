'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanSales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      HLaporanSalesId:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      namaToko:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      foto:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keterangan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamMasuk:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamKeluar:  {
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
    await queryInterface.dropTable('DLaporanSales');
  }
};