'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermintaanSuratPerintahs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idKaryawan: {
        type: Sequelize.INTEGER
      },
      idHRD: {
        type: Sequelize.INTEGER
      },
      dinas: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      tanggalMulai: {
        type: Sequelize.DATE
      },
      tanggalAkhir: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER
      },
      keteranganKaryawan: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('PermintaanSuratPerintahs');
  }
};