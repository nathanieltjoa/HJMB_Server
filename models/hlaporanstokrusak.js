'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HLaporanStokRusak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  HLaporanStokRusak.init({
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
  }, {
    sequelize,
    modelName: 'HLaporanStokRusak',
    tableName: 'hlaporanstokrusak'
  });
  HLaporanStokRusak.associate = function(models){
    HLaporanStokRusak.hasMany(models.DLaporanStokRusak,{as: 'dLaporanStokRusak'})
    HLaporanStokRusak.belongsTo(models.Karyawan, {foreignKey: 'idPelapor',as: 'karyawan'})
  }
  return HLaporanStokRusak;
};