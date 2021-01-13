
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'city', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'country', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'state');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'city');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'country');
  },
};
