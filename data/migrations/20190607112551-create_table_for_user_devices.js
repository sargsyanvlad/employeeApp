module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserDevices', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    deviceOs: {
      type: Sequelize.STRING,
    },
    deviceType: {
      type: Sequelize.STRING,
    },
    deviceId: {
      type: Sequelize.STRING,
      // unique: true,
      allowNull: true,
    },
    cloudToken: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
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
