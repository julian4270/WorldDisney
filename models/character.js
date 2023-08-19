'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
  
    static associate(models) {
    
    }
  };
  Character.init({
    Imagen: DataTypes.INT,
    Nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};