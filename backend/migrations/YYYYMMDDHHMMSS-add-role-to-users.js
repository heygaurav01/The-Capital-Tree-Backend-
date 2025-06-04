'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Comment out or remove this line:
    // await queryInterface.addColumn('Users', 'role', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   defaultValue: 'user'
    // });
  },

  down: async (queryInterface, Sequelize) => {
    // You can keep this if you want to allow rollback
    // await queryInterface.removeColumn('Users', 'role');
  }
};