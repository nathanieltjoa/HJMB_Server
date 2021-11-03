'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanStokistPipas', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanStokistPipaId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      LaporanStokId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      jumlahPipa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      diHapus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: true,
      },
      panjangPipa: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      beratPipa: {
        type: DataTypes.FLOAT,
        allowNull: false,
        unique: true,
      },
      totalBaik: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      totalBS: {
        type: DataTypes.INTEGER,
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
    await queryInterface.dropTable('DLaporanStokistPipas');
  }
};