'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanCatTegel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanCatTegel.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    idPelapor:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jenisProduk:  {
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
    modelName: 'HLaporanCatTegel',
    tableName: 'hlaporancattegel'
  });
  HLaporanCatTegel.associate = function(models){
    HLaporanCatTegel.hasMany(models.DLaporanCatTegel,{as: 'dLaporanCatTegel'})
    HLaporanCatTegel.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
  }
  return HLaporanCatTegel;
};