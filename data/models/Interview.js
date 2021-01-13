const DataTypes = require('sequelize');

const InterviewSchema = {
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
    defaultValue: true,
  },
  declinedByCompany: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  confirmedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  suggestedDates: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Pending', 'Confirmed', 'Declined'],
  },
  readByJobSeeker: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  readByCompany: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  changeReason: {
    type: DataTypes.STRING,
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

const InterviewOptions = {
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

const InterviewAssociations = (models) => {
  models.InterViews.hasMany(models.JobSeeker, {
    as: 'InterViewJobSeekers',
    foreignKey: 'id',
    sourceKey: 'jobSeekerId',
    onDelete: 'CASCADE',
  });
  models.InterViews.hasMany(models.Job, {
    as: 'InterViewJobs',
    foreignKey: 'id',
    sourceKey: 'jobId',
    onDelete: 'CASCADE',
  });
};

module.exports = (seq) => {
  const model = seq.define('InterViews', InterviewSchema, InterviewOptions);
  model.associate = InterviewAssociations;
  return model;
};
