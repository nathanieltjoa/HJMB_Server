'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermintaanPromosiJabatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idPenerima: {
        type: Sequelize.INTEGER
      },
      idPelapor: {
        type: Sequelize.INTEGER
      },
      idKaryawan: {
        type: Sequelize.INTEGER
      },
      kenaikan: {
        type: Sequelize.BOOLEAN
      },
      keterangan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('PermintaanPromosiJabatans');
  }
};