'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListKuisioners', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      divisi:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      namaKuisioner:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      deskripsiKuisioner:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jenisKuisioner:  {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('ListKuisioners');
  }
};