module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn({
      tableName: 'UserNotificationSettings',
      schema: 'public',
    }, 'allowNewMessages', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn({
      tableName: 'UserNotificationSettings',
      schema: 'public',
    }, 'allowNewMessages');
  },
};
