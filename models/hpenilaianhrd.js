'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HPenilaianHRD extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HPenilaianHRD.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    idKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    totalNilai: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    jumlahNilai: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    jumlahKaryawan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'HPenilaianHRD',
    tableName: 'HPenilaianHRD',
  });
  HPenilaianHRD.associate = function(models){
    HPenilaianHRD.hasMany(models.DPenilaianHRD,{as: 'dPenilaianHRD', foreignKey: 'DPenilaianHRDId'})
    HPenilaianHRD.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'hPenilaianHRD'})
  }
  return HPenilaianHRD;
};