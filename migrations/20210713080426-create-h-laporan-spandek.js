'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanSpandeks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idPelapor: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKetua: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      jenisProduk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      totalPanjang: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      totalBS: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      totalBerat: {
        type: DataTypes.FLOAT,
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
    await queryInterface.dropTable('HLaporanSpandeks');
  }
};