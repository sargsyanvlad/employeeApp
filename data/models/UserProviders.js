const DataTypes = require('sequelize');

const UserProvidersSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  provider: {
    type: DataTypes.STRING,
  },
  providerId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

const UserProvidersOptions = {
  timestamps: true,
};

const UserProvidersAssociation = (models) => {
  models.UserProviders.belongsTo(models.User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
};

module.exports = (seq) => {
  const model = seq.define('UserProviders', UserProvidersSchema, UserProvidersOptions);
  model.associate = UserProvidersAssociation;
  return model;
};
