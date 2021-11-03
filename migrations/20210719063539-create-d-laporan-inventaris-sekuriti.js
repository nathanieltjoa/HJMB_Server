'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanInventarisSekuritis', {
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
      namaBarang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahBarang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      baik: {
        type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('DLaporanInventarisSekuritis');
  }
};