const DataTypes = require('sequelize');

const BlockedUsersSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  blockerId: {
    type: DataTypes.INTEGER,
  },
  blockedId: {
    type: DataTypes.INTEGER,
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

const BlockedUsersOptions = {
  timeStamp: true,
};

const BlockedUsersAssociations = (models) => {
  models.BlockedUsers.belongsTo(models.User, {
    as: 'blockedBy',
    foreignKey: 'blockerId',
  });
  models.BlockedUsers.belongsTo(models.User, {
    as: 'blockedUser',
    foreignKey: 'blockedId',
  });
};

module.exports = (seq) => {
  const model = seq.define('BlockedUsers', BlockedUsersSchema, BlockedUsersOptions);

  model.associate = BlockedUsersAssociations;

  return model;
};
