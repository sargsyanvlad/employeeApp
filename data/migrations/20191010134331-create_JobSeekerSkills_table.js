
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobSeekerSkills', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      skillId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Skills',
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
    await queryInterface.dropTable('JobSeekerSkills', { schema: 'public' });
  },
};
