const DataTypes = require('sequelize');

const RequirementIndustriesSchema = {
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
  industryId: {
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

const RequirementIndustriesOptions = {
  timestamps: true,
  freezeTableName: true,
};

const RequirementIndustriesAssociation = (models) => {
  models.RequirementIndustries.belongsTo(models.Requirement, {
    as: 'requirement',
    foreignKey: 'requirementId',
  });
};

module.exports = (seq) => {
  const model = seq.define('RequirementIndustries', RequirementIndustriesSchema, RequirementIndustriesOptions);
  model.associate = RequirementIndustriesAssociation;
  return model;
};
