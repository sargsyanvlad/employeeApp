
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('RequirementInterests', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    requirementId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Requirements',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    interestId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Interests',
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
  }, {
    schema: 'public',
  }),
};
