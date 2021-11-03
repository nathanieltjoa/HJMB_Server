'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Karyawans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nik: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tanggalMasuk: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      tempatLahir: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tanggalLahir: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: true,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      agama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pendidikan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      idJabatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Karyawans');
  }
};