'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanKetuaStokistPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanKetuaStokistPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    idPelapor:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    shift:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mesin:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalBaik:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalBS:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'HLaporanKetuaStokistPipa',
    tableName: 'HLaporanKetuaStokistPipa'
  });
  HLaporanKetuaStokistPipa.associate = function(models){
    HLaporanKetuaStokistPipa.hasMany(models.DLaporanKetuaStokistPipa,{as: 'dLaporanKetuaSP'})
  }
  return HLaporanKetuaStokistPipa;
};