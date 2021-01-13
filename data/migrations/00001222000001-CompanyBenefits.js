
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CompanyBenefit', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Companies',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    BenefitId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Benefits',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
      allowNull: false,
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
  }),
};
