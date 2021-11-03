'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ULaporanProduksiPipas', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      idDLaporan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      namaUraian: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nilaiUraian: {
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
    await queryInterface.dropTable('ULaporanProduksiPipas');
  }
};