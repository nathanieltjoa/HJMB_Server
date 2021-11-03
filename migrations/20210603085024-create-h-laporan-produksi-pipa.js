'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanProduksiPipas', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      shift:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tipeMesin:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      warna:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ukuran:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idPelapor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      dis: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      pin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      hasilProduksi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      jumlahBahan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      BS: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      totalBahan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('HLaporanProduksiPipas');
  }
};