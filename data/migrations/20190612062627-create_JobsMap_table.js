module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('JobsMap', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    jobId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Jobs',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    jobSeekerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'JobSeekers',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    appliedByJobSeeker: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    declinedByJobSeeker: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    appliedByCompany: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    declinedByCompany: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    schema: 'public',
  }).then(() => queryInterface.addConstraint('public.JobsMap', ['jobSeekerId', 'userId', 'jobId'], {
    type: 'unique',
    name: 'UniqueAppliedJobSeeker',
  })),
};
