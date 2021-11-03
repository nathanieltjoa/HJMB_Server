'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Permintaans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPeminta: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      jenis: {
        type: DataTypes.STRING,
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
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      idKetua: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      idHRD: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      alasan: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Permintaans');
  }
};