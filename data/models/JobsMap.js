const DataTypes = require('sequelize');

const JobsMapSchema = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  jobSeekerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appliedByJobSeeker: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  declinedByJobSeeker: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  appliedByCompany: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  declinedByCompany: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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

const JobsMapOptions = {
  indexes: [
    {
      unique: true,
      name: 'UniqueAppliedJobSeeker',
      fields: ['jobSeekerId', 'userId', 'jobId'],
    },
  ],
  timestamps: true,
  schema: 'public',
  freezeTableName: true,
};

const JobsMapAssociations = (models) => {
  // fixme Should be removed and left only association described above when FrontEnd
  // fixme this two same associations left only for backward compatibility
  models.JobsMap.hasMany(models.JobSeeker, {
    as: 'JobSeekers',
    foreignKey: 'id',
    sourceKey: 'jobSeekerId',
  });

  models.JobsMap.belongsTo(models.JobSeeker, {
    as: 'jobSeeker',
    sourceKey: 'jobSeekerId',
  });

  models.JobsMap.belongsTo(models.Job, {
    as: 'job',
    foreignKey: 'jobId',
  });

  models.JobsMap.belongsTo(models.User, {
    as: 'user',
    foreignKey: 'userId',
  });
};

module.exports = (seq) => {
  const model = seq.define('JobsMap', JobsMapSchema, JobsMapOptions);
  model.associate = JobsMapAssociations;
  return model;
};
