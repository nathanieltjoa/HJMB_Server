'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ULaporanCatTegel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ULaporanCatTegel.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    DLaporanCatTegelId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaBahan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    jumlahBahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    satuanBahan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    diHapus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'ULaporanCatTegel',
    tableName: 'ulaporancattegel'
  });
  ULaporanCatTegel.associate = function(models){
    ULaporanCatTegel.belongsTo(models.DLaporanCatTegel,{foreignKey: 'DLaporanCatTegelId', as: 'uLaporanCatTegel'})
  }
  return ULaporanCatTegel;
};