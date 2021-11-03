'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TargetKerjas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      namaDivisi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      namaPengerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahTarget: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
      satuanTarget: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('TargetKerjas');
  }
};