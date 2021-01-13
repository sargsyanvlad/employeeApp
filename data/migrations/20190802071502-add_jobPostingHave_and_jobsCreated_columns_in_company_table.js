
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn({
    tableName: 'Companies',
    schema: 'public',
  }, 'jobsCreated', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }).then(() => queryInterface.addColumn({
    tableName: 'Companies',
    schema: 'public',
  }, 'jobPostingHave', {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  })),
};
