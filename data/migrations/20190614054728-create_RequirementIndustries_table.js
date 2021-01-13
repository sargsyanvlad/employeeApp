module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('RequirementIndustries', {
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
    industryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Industries',
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
