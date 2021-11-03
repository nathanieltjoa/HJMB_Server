'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PenilaianHRDs', {
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
      idKaryawan:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      IndexPenilaianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nilaiKaryawan:  {
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
    await queryInterface.dropTable('PenilaianHRDs');
  }
};