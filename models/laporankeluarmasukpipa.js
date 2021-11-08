'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaporanKeluarMasukPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LaporanKeluarMasukPipa.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    LaporanStokId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    terimaLaporan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jenisLaporan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahLaporan:  {
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
    modelName: 'LaporanKeluarMasukPipa',
    tableName: 'laporankeluarmasukpipa',
  });
  LaporanKeluarMasukPipa.associate = function(models){
    LaporanKeluarMasukPipa.belongsTo(models.LaporanStok, {foreignKey: 'LaporanStokId',as: 'laporanStokKeluarMasukPipa'})
  }
  return LaporanKeluarMasukPipa;
};