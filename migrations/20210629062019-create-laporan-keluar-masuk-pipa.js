'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LaporanKeluarMasukPipas', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      LaporanStokId:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      terimaLaporan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jenisLaporan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahLaporan:  {
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
    await queryInterface.dropTable('LaporanKeluarMasukPipas');
  }
};