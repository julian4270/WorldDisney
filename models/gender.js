'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gender extends Model {
  
    static associate(models) {
    
    }
  };
  Gender.init({
    Imagen: DataTypes.INT,
    Nombre: DataTypes.STRING,
    Películas: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Género',
  });
  return Gender;
};