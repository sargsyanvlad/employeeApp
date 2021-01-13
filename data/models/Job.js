module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    'Job',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      salary: {
        type: DataTypes.INTEGER,
      },
      type: {
        type: DataTypes.ENUM,
        values: ['Full-time', 'Part-time', 'Internship', 'Other'],
        validate: {
          isIn: {
            args: [['Full-time', 'Part-time', 'Internship', 'Other']],
            msg: ['type'],
          },
        },
      },
      companyLogo: {
        type: DataTypes.STRING,
      },
      companyName: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      requirementId: {
        type: DataTypes.STRING, // UUID
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'cascade',
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Companies',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'cascade',
      },
    },
    {
      timestamps: true,
    },
  );

  Job.associate = (models) => {
    Job.hasOne(models.Requirement, {
      as: 'Requirement',
      foreignKey: 'jobId',
      onDelete: 'CASCADE',
    });
    Job.belongsToMany(models.JobSeeker, {
      through: 'JobsMap',
      as: 'reactedJobSeekers',
      sourceKey: 'id',
      foreignKey: 'jobId',
      otherKey: 'jobSeekerId',
    });
    Job.hasMany(models.JobsMap, { // fixme Incorrect(hiiimmaar) association should be removed
      as: 'JobsMap',
      foreignKey: 'jobId',
      onDelete: 'CASCADE',
    });
  };

  return Job;
};
