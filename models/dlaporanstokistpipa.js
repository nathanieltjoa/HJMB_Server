'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanStokistPipa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanStokistPipa.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanStokistPipaId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    LaporanStokId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    jumlahPipa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    diHapus: {
      type: DataTypes.BOOLEAN,
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
  }, {
    sequelize,
    modelName: 'DLaporanStokistPipa',
    tableName: 'dlaporanstokistpipa',
  });
  DLaporanStokistPipa.associate = function(models){
    DLaporanStokistPipa.belongsTo(models.HLaporanStokistPipa, {foreignKey: 'HLaporanStokistPipaId',as: 'hLaporanStokistPipa'})
    DLaporanStokistPipa.belongsTo(models.LaporanStok, {foreignKey: 'LaporanStokId',as: 'laporanStokStokistPipa'})
  }
  return DLaporanStokistPipa;
};