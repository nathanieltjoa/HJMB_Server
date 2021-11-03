'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DPenilaianHRDs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HPenilaianHRDId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      IndexPenilaianId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idPenilai: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      nilai: {
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
    await queryInterface.dropTable('DPenilaianHRDs');
  }
};