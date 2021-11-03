'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PengaruhNilais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nilaiMin: {
        type: Sequelize.FLOAT
      },
      nilaiMax: {
        type: Sequelize.FLOAT
      },
      hasilNilai: {
        type: Sequelize.STRING
      },
      pengurangan: {
        type: Sequelize.BOOLEAN
      },
      nilaiUang: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('PengaruhNilais');
  }
};