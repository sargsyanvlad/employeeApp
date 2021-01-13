
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('FavoriteJobs', {
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
    jobId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Jobs',
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
  }).then(() => queryInterface.addConstraint('public.FavoriteJobs', ['jobId', 'userId'], {
    type: 'unique',
    name: 'UniqueFavoriteJobs',
  })),
};
