'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Films extends Model {
  
    static associate(models) {
    
    }
  };
  Films.init({
    Imagen: DataTypes.INT,
    Título: DataTypes.STRING,
    Fecha: DataTypes.DATE,
    Calificación: DataTypes.STRING,
    Personajes: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Películas',
  });
  return Films;
};