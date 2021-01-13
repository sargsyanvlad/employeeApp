

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ChatAuthTokens', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Users',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    authToken: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }).then(() => queryInterface.addConstraint('public.ChatAuthTokens', ['userId', 'authToken'], {
    type: 'unique',
    name: 'UniqueChatAuthToken',
  })),
};
