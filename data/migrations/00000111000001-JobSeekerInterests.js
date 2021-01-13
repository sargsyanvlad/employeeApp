
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('JobSeekerInterests', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    // Note userId was left only for backward compatibility
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    interestId: {
      type: Sequelize.INTEGER,
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
  }),
};
