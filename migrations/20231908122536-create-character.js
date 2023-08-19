'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('personaje', {
      Imagen: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Nombre: {
        type: Sequelize.STRING
      },
      Edad: {
        type: Sequelize.TEXT
      },
      Peso: {
        type: Sequelize.INTEGER
      },
      Historia: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      Peliculas: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('personaje');
  }
};