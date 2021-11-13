'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HPenilaianKuisioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HPenilaianKuisioner.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    ListKuisionerId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
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
    modelName: 'HPenilaianKuisioner',
    tableName: 'hpenilaiankuisioner',
  });
  HPenilaianKuisioner.associate = function(models){
    HPenilaianKuisioner.hasMany(models.DPenilaianKuisioner,{as: 'dPenilaianKuisioner', foreignKey: 'HPenilaianKuisionerId'})
    HPenilaianKuisioner.belongsTo(models.Karyawan, {foreignKey: 'idKaryawan',as: 'karyawan'})
    HPenilaianKuisioner.belongsTo(models.ListKuisioner, {foreignKey: 'ListKuisionerId',as: 'kuisioner'})
  }
  return HPenilaianKuisioner;
};