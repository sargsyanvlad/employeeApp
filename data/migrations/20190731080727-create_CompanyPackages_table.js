

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CompanyPackages', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      required: true,
      references: {
        model: {
          tableName: 'Users',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    companyId: {
      type: Sequelize.INTEGER,
      required: true,
      references: {
        model: {
          tableName: 'Companies',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    PackageId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Packages',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    validThru: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    exhausted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    metaData: {
      type: Sequelize.JSONB,
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
  }),
};
