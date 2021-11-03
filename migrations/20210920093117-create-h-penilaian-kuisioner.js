'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HPenilaianKuisioners', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      idKaryawan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalNilai: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      jumlahNilai: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      jumlahKaryawan: {
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
    await queryInterface.dropTable('HPenilaianKuisioners');
  }
};