'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DPenilaianKuisioners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HPenilaianKuisionerId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ListKuisionerId: {
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
        type: DataTypes.FLOAT,
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
    await queryInterface.dropTable('DPenilaianKuisioners');
  }
};