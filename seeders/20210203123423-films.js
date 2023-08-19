'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Película', [
        {
          Imagen: new Int32Array,
          Título: new String,
          Fecha: new Date,
          Calificación: new String,
          Personajes: new String
        
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Película', null, { 
      truncate:true,
      restartIdentity:true 
    });
  }
};
