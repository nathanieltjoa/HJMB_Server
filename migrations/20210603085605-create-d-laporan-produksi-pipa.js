'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanProduksiPipas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idHLaporan: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      totalProduksi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      targetProduksi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      pernahBanding: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: true,
      },
      keteranganBanding: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      jamLaporan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keterangan: {
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
    await queryInterface.dropTable('DLaporanProduksiPipas');
  }
};