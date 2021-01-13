

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'latitude', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'longitude', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'locationPoint', {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'latitude');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'longitude');

    await queryInterface.removeColumn({
      tableName: 'JobSeekers',
      schema: 'public',
    }, 'location');
  },
};
