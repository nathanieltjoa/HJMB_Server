'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListDistribusiKuisioners', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      ListKuisionerId:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      TingkatJabatan:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      persentaseNilai:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      status:  {
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
    await queryInterface.dropTable('ListDistribusiKuisioners');
  }
};