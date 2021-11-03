'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanHollows', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanHollowId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ukuran: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ketebalan: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      berat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      noCoil: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      BS: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      pernahBanding: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      keteranganBanding: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('DLaporanHollows');
  }
};