'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ULaporanProduksiPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //ULaporanProduksiPipa.belongsTo(models.DLaporanProduksiPipa, {foreignKey:'idDLaporan', as: 'idDLaporan_Constraint'})
    }
  };
  ULaporanProduksiPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    DLaporanProduksiPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaUraian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    nilaiUraian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ULaporanProduksiPipa',
    tableName: 'ULaporanProduksiPipa',
  });
  ULaporanProduksiPipa.associate = function(models){
    ULaporanProduksiPipa.belongsTo(models.DLaporanProduksiPipa,{foreignKey: 'DLaporanProduksiPipaId', as: 'uLaporan'})
  }
  return ULaporanProduksiPipa;
};