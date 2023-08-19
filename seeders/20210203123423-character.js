'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Characters', [
        {
          Imagen: new Int32Array,
          Nombre: new String,
          Edad: new String,
          Peso: new String,
          Historia: new String,
          Películas: new String
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Characters', null, { 
      truncate:true,
      restartIdentity:true 
    });
  }
};
