'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DLaporanSpandek extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DLaporanSpandek.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    HLaporanSpandekId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    namaPemesan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    warna: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ukuran: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    berat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    panjang: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    BS: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: true,
    },
    noCoil: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    keterangan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    foto: {
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
    modelName: 'DLaporanSpandek',
    tableName: 'DLaporanSpandek',
  });
  DLaporanSpandek.associate = function(models){
    DLaporanSpandek.belongsTo(models.HLaporanSpandek, {foreignKey: 'HLaporanSpandekId',as: 'hLaporanSpandek'})
  }
  return DLaporanSpandek;
};