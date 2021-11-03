'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListJawabans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      ListPertanyaanId:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      teskJawaban:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      benar:  {
        type: DataTypes.BOOLEAN,
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
    await queryInterface.dropTable('ListJawabans');
  }
};