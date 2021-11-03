'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanHollows', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      idPelapor:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKetua:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalBerat:  {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      totalJumlah:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalBS:  {
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
    await queryInterface.dropTable('HLaporanHollows');
  }
};