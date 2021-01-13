const DataTypes = require('sequelize');

const RequirementSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  generalRequirement: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  country: {
    type: DataTypes.STRING,
  },
  educationLevel: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  location: {
    type: DataTypes.GEOMETRY('POINT'),
  },
  duration: {
    type: DataTypes.FLOAT(4),
  },
  jobId: {
    type: DataTypes.INTEGER,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxDistance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
};

const RequirementOptions = {
  timestamps: true,
};

const RequirementAssociation = (models) => {
  models.Requirement.belongsToMany(models.Interest, {
    through: 'RequirementInterests',
    as: 'interests',
    sourceKey: 'id',
    foreignKey: 'requirementId',
    otherKey: 'interestId',
  });
  models.Requirement.belongsToMany(models.Industry, {
    through: 'RequirementIndustries',
    as: 'industries',
    sourceKey: 'id',
    foreignKey: 'requirementId',
    otherKey: 'industryId',
  });
  models.Requirement.belongsToMany(models.Occupation, {
    through: 'RequirementOccupations',
    as: 'occupations',
    sourceKey: 'id',
    foreignKey: 'requirementId',
    otherKey: 'occupationId',
  });
};

module.exports = (seq) => {
  const model = seq.define('Requirement', RequirementSchema, RequirementOptions);
  model.associate = RequirementAssociation;
  return model;
};

