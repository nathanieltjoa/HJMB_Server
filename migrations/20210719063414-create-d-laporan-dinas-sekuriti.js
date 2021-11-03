'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanDinasSekuritis', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanSekuritiId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idPelapor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      jamMasuk: {
        type: DataTypes.TIME,
        allowNull: false,
        unique: true,
      },
      jamKeluar: {
        type: DataTypes.TIME,
        allowNull: false,
        unique: true,
      },
      noHT: {
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
    await queryInterface.dropTable('DLaporanDinasSekuritis');
  }
};