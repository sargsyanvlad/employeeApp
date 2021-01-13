module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '',
    });
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'firstName');

    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'lastName');
  },
};
