'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permintaans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idPeminta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      IzinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      tanggalMulai: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      tanggalBerakhir: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      totalHari: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      upload: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('Permintaans');
  }
};