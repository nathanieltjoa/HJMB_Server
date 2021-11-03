'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListPertanyaans', {
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
      teskPertanyaan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jenisPertanyaan:  {
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
    await queryInterface.dropTable('ListPertanyaans');
  }
};