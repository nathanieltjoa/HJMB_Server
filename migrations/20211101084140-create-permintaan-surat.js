'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermintaanSurats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idHRD: {
        type: Sequelize.INTEGER
      },
      idKaryawan: {
        type: Sequelize.INTEGER
      },
      tanggalKerja: {
        type: Sequelize.DATEONLY
      },
      file: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      keteranganHRD: {
        type: Sequelize.STRING
      },
      disetujui: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('PermintaanSurats');
  }
};