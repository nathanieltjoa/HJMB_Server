'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanQualityControlPipas', {
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
      idPelapor:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKetua:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      merk:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      panjang:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      ketebalan:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      diameterLuar:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      diameterDalam:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalReject:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalProduksi:  {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('HLaporanQualityControlPipas');
  }
};