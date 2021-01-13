module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('InterViews', {
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
    location: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['Pending', 'Confirmed', 'Declined'],
    },
    confirmedDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    suggestedDates: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    readByJobSeeker: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    readByCompany: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    changeReason: {
      type: Sequelize.STRING,
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
  }).then(() => queryInterface.addConstraint('InterViews', ['jobSeekerId', 'userId', 'jobId'], {
    type: 'unique',
    name: 'UniqueInterviewJobSeeker',
  })),
};
