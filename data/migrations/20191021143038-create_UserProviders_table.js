module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserProviders', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      provider: {
        type: Sequelize.STRING,
      },
      providerId: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'Users',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'cascade',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }, {
      schema: 'public',
    });
    await queryInterface.addConstraint('public.UserProviders', ['provider', 'userId'], {
      type: 'unique',
      name: 'UniqueUserProvider',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserProviders', { schema: 'public' });
  }
};
