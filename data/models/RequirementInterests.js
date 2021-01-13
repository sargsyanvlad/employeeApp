const DataTypes = require('sequelize');

const RequirementInterestsSchema = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  requirementId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const RequirementInterestsOptions = {
  timestamps: true,
  freezeTableName: true,
};

const RequirementInterestsAssociation = (models) => {
  models.RequirementInterests.belongsTo(models.Requirement, {
    as: 'requirement',
    foreignKey: 'requirementId',
  });
};

module.exports = (seq) => {
  const model = seq.define('RequirementInterests', RequirementInterestsSchema, RequirementInterestsOptions);
  model.associate = RequirementInterestsAssociation;
  return model;
};
