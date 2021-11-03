'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanArmadas', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanArmadaId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      merkBarang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tipeBarang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ukuranBarang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahBarang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      satuanBarang: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      diHapus: {
        type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('DLaporanArmadas');
  }
};