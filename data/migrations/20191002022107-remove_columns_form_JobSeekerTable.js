

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'provider');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'linkedInId');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'facebookId');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'firstName');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'lastName');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'linkedInId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'facebookId', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'provider', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
