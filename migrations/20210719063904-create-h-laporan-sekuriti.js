'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HLaporanSekuritis', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      GudangId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      shift: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idKetua: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idPenyerah: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idPenerima: {
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
    await queryInterface.dropTable('HLaporanSekuritis');
  }
};