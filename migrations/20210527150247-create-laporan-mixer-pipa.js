'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LaporanMixerPipas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      tipeMesin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      bahanDigunakan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      totalHasil: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      targetMixer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idPelapor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      idKetua: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('LaporanMixerPipas');
  }
};