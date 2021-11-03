'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanKetuaStokistPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanKetuaStokistPipa.init({
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
  }, {
    sequelize,
    modelName: 'DLaporanKetuaStokistPipa',
    tableName: 'DLaporanKetuaStokistPipa',
  });
  DLaporanKetuaStokistPipa.associate = function(models){
    DLaporanKetuaStokistPipa.belongsTo(models.HLaporanKetuaStokistPipa, {foreignKey: 'HLaporanKetuaStokistPipaId',as: 'dLaporanKetuaSP'})
  }
  return DLaporanKetuaStokistPipa;
};