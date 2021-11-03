'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DLaporanKetuaStokistPipas', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      HLaporanKetuaStokistPipaId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      merkPipa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      jenisPipa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      ukuranPipa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      warnaPipa: {
        type: DataTypes.STRING,
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
      keterangan: {
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
    await queryInterface.dropTable('DLaporanKetuaStokistPipas');
  }
};