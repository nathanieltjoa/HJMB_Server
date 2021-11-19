'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ULaporanArmadas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DLaporanArmadaId: {
        type: Sequelize.STRING
      },
      merkBarang: {
        type: Sequelize.STRING
      },
      tipeBarang: {
        type: Sequelize.STRING
      },
      ukuranBarang: {
        type: Sequelize.STRING
      },
      jumlahBarang: {
        type: Sequelize.INTEGER
      },
      satuanBarang: {
        type: Sequelize.STRING
      },
      diHapus: {
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
    await queryInterface.dropTable('ULaporanArmadas');
  }
};