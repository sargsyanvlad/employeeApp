/* eslint-disable no-underscore-dangle, no-console */

module.exports = (sequelize, DataTypes) => {
  const CompanyPackages = sequelize.define(
    'CompanyPackages',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
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
        type: DataTypes.DATE,
        allowNull: false,
      },
      exhausted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metaData: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );

  return CompanyPackages;
};
