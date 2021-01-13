

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CompanyUsers', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    companyId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Companies',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
      allowNull: false,
    },
    UserId: {
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
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }),
};
