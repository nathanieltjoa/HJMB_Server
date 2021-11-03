'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ListTanggapans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      ListPertanyaanId:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      idKaryawan:  {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      teskTanggapan:  {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ListJawabanId:  {
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
    await queryInterface.dropTable('ListTanggapans');
  }
};