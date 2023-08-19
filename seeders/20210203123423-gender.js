'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('género', [
        {
          Imagen: new Int32Array,
          Nombre: new String,
          Películas: new String
        
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('género', null, { 
      truncate:true,
      restartIdentity:true 
    });
  }
};
