module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserNotificationSettings', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    deviceId: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      unique: true,
      references: {
        model: {
          tableName: 'Users',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
      allowNull: true,
    },
    allowNotifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    schema: 'public',
  }),
};
