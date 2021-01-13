module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'Employments',
      schema: 'public',
    }, 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'Employments',
      schema: 'public',
    }, 'description');
  },
};
