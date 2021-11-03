'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanKetuaStokistPipas', {
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
      shift:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mesin:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      totalBaik:  {
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
    await queryInterface.dropTable('HLaporanKetuaStokistPipas');
  }
};