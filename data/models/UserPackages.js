/* eslint-disable no-underscore-dangle, no-console */

module.exports = (sequelize, DataTypes) => {
  const UserPackages = sequelize.define(
    'UserPackages',
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
      jobSeekerId: {
        type: DataTypes.INTEGER,
        required: true,
        references: {
          model: {
            tableName: 'JobSeekers',
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
        allowNull: true,
        defaultValue: {},
      },
    },
    {
      timestamps: true,
    },
  );

  return UserPackages;
};
