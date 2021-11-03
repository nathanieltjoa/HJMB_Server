'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanQualityControlPipas', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      HLaporanQualityControlPipaId:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamLaporan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      diameter:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      panjang:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      berat:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      status:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      pernahBanding :  {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      keteranganBanding:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      foto: {
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
    await queryInterface.dropTable('DLaporanQualityControlPipas');
  }
};