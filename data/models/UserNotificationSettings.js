const DataTypes = require('sequelize');

const UserNotificationSettingsSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
  },
  deviceId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  allowNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  allowNewMessages: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const UserNotificationSettingsOptions = {
  timestamps: true,
};

const UserNotificationSettingsAssociation = (models) => {
  models.UserNotificationSettings.belongsTo(models.User, {
    as: 'notificationSettings',
    foreignKey: 'userId',
  });
};

module.exports = (seq) => {
  const model = seq.define('UserNotificationSettings', UserNotificationSettingsSchema, UserNotificationSettingsOptions);

  model.associate = UserNotificationSettingsAssociation;

  return model;
};
