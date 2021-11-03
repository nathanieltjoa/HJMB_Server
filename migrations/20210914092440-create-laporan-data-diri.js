'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('LaporanDataDiris', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      idKaryawan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      bagianData: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      dataSeharusnya: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idHRD: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      status: {
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
    await queryInterface.dropTable('LaporanDataDiris');
  }
};