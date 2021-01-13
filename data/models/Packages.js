/* eslint-disable no-underscore-dangle, no-console */

module.exports = (sequelize, DataTypes) => {
  const Packages = sequelize.define(
    'Packages',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      for: {
        type: DataTypes.ENUM,
        values: ['jobSeeker', 'company', 'companyUser'],
      },
      name: {
        type: DataTypes.STRING,
        required: true,
      },
      extraData: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    },
  );

  return Packages;
};
