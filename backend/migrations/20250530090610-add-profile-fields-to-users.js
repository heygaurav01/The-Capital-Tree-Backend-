'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'firstName', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'lastName', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'dob', { type: Sequelize.DATEONLY });
    await queryInterface.addColumn('Users', 'address', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'city', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'country', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'citizenship', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'taxIdNumber', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'aadhaarNumber', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'panNumber', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'aadhaarDocUrl', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'panDocUrl', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'kycCompleted', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'firstName');
    await queryInterface.removeColumn('Users', 'lastName');
    await queryInterface.removeColumn('Users', 'dob');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'country');
    await queryInterface.removeColumn('Users', 'citizenship');
    await queryInterface.removeColumn('Users', 'taxIdNumber');
    await queryInterface.removeColumn('Users', 'aadhaarNumber');
    await queryInterface.removeColumn('Users', 'panNumber');
    await queryInterface.removeColumn('Users', 'aadhaarDocUrl');
    await queryInterface.removeColumn('Users', 'panDocUrl');
    await queryInterface.removeColumn('Users', 'kycCompleted');
  }
};
