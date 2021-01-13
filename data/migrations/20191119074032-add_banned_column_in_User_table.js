module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'banned', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'banned');
  },
};
