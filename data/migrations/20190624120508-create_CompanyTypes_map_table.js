
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CompanyTypes', {
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
      industryId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Industries',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'cascade',
        allowNull: false,
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
    await queryInterface.dropTable('CompanyTypes',{ schema: 'public' });
  }
};
