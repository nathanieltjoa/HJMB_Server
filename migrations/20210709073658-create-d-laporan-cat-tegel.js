'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanCatTegels', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanCatTegelId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      merkProduk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      warna: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahProduk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      satuanProduk: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      khusus: {
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
    await queryInterface.dropTable('DLaporanCatTegels');
  }
};