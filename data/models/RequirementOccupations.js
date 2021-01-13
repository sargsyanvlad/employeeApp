const DataTypes = require('sequelize');

const RequirementOccupationsSchema = {
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
  occupationId: {
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

const RequirementOccupationsOptions = {
  timestamps: true,
  freezeTableName: true,
};

const RequirementOccupationsAssociation = (models) => {
  models.RequirementOccupations.belongsTo(models.Requirement, {
    as: 'requirement',
    foreignKey: 'requirementId',
  });
};

module.exports = (seq) => {
  const model = seq.define('RequirementOccupations', RequirementOccupationsSchema, RequirementOccupationsOptions);
  model.associate = RequirementOccupationsAssociation;
  return model;
};
