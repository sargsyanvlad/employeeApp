module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'provider', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'providerId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'completed', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'provider');

    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'providerId');
    await queryInterface.removeColumn({
      tableName: 'Users',
      schema: 'public',
    }, 'completed');
  },
};
