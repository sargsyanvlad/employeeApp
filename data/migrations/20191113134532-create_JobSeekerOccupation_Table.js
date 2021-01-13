
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobSeekerOccupations', {
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
      occupationId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('JobSeekerOccupations', { schema: 'public' });
  }
};
