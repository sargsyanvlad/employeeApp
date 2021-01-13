

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequirementOccupations', {
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
      occupationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Occupation',
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RequirementOccupations', { schema: 'public' });
  }
};
