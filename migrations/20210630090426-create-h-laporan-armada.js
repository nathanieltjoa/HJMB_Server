'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanArmadas', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      idNota: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idArmada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idStokist: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idSupir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKernet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      penerima: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pengantaran: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      kembali: {
        type: DataTypes.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('HLaporanArmadas');
  }
};