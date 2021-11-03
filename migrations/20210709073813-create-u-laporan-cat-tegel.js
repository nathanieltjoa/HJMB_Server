'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ULaporanCatTegels', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        autoIncrement: false,
      },
      DLaporanCatTegelId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      namaBahan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jumlahBahan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      satuanBahan: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      diHapus: {
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
    await queryInterface.dropTable('ULaporanCatTegels');
  }
};