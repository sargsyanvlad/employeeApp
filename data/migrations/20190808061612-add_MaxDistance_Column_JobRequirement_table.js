
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn({
    tableName: 'Requirements',
    schema: 'public',
  }, 'maxDistance', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }),
};
