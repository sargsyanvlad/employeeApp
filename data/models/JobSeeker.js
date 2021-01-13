const errorDetails = require('../../utils/errorDetails');
const { USER_GENDERS } = require('../../utils/constants');

const DataTypes = require('sequelize');

const JobSeekerSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    unique: true,
  },
  gender: {
    type: DataTypes.ENUM,
    values: [USER_GENDERS.MALE, USER_GENDERS.FEMALE, USER_GENDERS.OTHER],
    validate: {
      isIn: {
        args: [[USER_GENDERS.MALE, USER_GENDERS.FEMALE, USER_GENDERS.OTHER]],
        msg: errorDetails.INVALID_GENDER,
      },
    },
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING(50),
    validate: {
      len: [6, 30],
    },
  },
  about: {
    type: DataTypes.TEXT,
  },
  userId: DataTypes.INTEGER,
  meta: DataTypes.JSONB,
  docs: DataTypes.JSONB,
  latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  locationPoint: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false,
  },
};
const JobSeekerOptions = {
  timestamps: true,
};

const JobSeekerAssociations = (models) => {
  models.JobSeeker.belongsToMany(models.Interest, {
    through: 'JobSeekerInterests',
    as: 'Interests',
    sourceKey: 'id',
    foreignKey: 'jobSeekerId',
    otherKey: 'interestId',
  });
  models.JobSeeker.belongsToMany(models.Industry, {
    through: 'JobSeekerIndustries',
    as: 'Industries',
    sourceKey: 'id',
    foreignKey: 'jobSeekerId',
    otherKey: 'industryId',
  });

  models.JobSeeker.belongsToMany(models.Skills, {
    through: 'JobSeekerSkills',
    as: 'skills',
    sourceKey: 'id',
    foreignKey: 'jobSeekerId',
    otherKey: 'skillId',
  });

  models.JobSeeker.belongsToMany(models.Occupation, {
    through: 'JobSeekerOccupations',
    as: 'occupations',
    sourceKey: 'id',
    foreignKey: 'jobSeekerId',
    otherKey: 'occupationId',
  });

  models.JobSeeker.hasMany(models.Education, {
    as: 'Education',
    foreignKey: 'jobSeekerId',
    onDelete: 'CASCADE',
    hierarchy: true
  });

  models.JobSeeker.hasMany(models.User, {
    as: 'user',
    foreignKey: 'id',
    sourceKey: 'userId',
    onDelete: 'CASCADE',
  });

  models.JobSeeker.hasMany(models.Employment, {
    as: 'Employment',
    foreignKey: 'jobSeekerId',
    onDelete: 'CASCADE',
  });
};

module.exports = (seq) => {
  const model = seq.define('JobSeeker', JobSeekerSchema, JobSeekerOptions);
  model.associate = JobSeekerAssociations;
  return model;
};
