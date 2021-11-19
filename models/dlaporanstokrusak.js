'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanStokRusak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanStokRusak.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanStokRusakId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    LaporanStokId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'DLaporanStokRusak',
    tableName: 'dlaporanstokrusak',
  });
  DLaporanStokRusak.associate = function(models){
    DLaporanStokRusak.belongsTo(models.HLaporanStokRusak, {foreignKey: 'HLaporanStokRusakId',as: 'hLaporan'})
    DLaporanStokRusak.belongsTo(models.LaporanStok, {foreignKey: 'LaporanStokId',as: 'barang'})
  }
  return DLaporanStokRusak;
};