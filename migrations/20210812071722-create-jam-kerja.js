'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('JamKerjas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      namaShift: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamMasuk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jamKeluar: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      batasMasuk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      batasKeluar: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('JamKerjas');
  }
};