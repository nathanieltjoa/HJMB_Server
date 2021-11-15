'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListTanggapan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ListTanggapan.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      autoIncrement: false,
    },
    ListPertanyaanId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    idKaryawan:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    teskTanggapan:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ListJawabanId:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status:  {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
  }, {
    sequelize,
    modelName: 'ListTanggapan',
    tableName: 'listtanggapan',
  });
  ListTanggapan.associate = function(models){
    ListTanggapan.belongsTo(models.ListPertanyaan, {foreignKey: 'ListPertanyaanId',as: 'listTanggapan'})
  }
  return ListTanggapan;
};