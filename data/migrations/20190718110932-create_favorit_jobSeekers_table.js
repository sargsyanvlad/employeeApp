

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('FavoriteJobSeekers', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
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
      references: {
        model: {
          tableName: 'JobSeekers',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }).then(() => queryInterface.addConstraint('public.FavoriteJobSeekers', ['jobSeekerId', 'userId'], {
    type: 'unique',
    name: 'UniqueFavoriteJobSeeker',
  })),
};
