'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanStokistPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanStokistPipa.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.STRING
    },
    idPelapor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKetua: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
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
  }, {
    sequelize,
    modelName: 'HLaporanStokistPipa',
    tableName: 'HLaporanStokistPipa',
  });
  HLaporanStokistPipa.associate = function(models){
    HLaporanStokistPipa.hasMany(models.DLaporanStokistPipa,{as: 'dLaporanStokistPipa'})
    HLaporanStokistPipa.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
    HLaporanStokistPipa.belongsTo(models.Karyawan, {foreignKey: 'idKetua',as: 'ketua'})
  }
  return HLaporanStokistPipa;
};