/* eslint-disable no-underscore-dangle, no-console */

module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      reporterId: {
        type: DataTypes.INTEGER,
        required: true,
      },
      reportingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
    },
  );

  Reports.associate = (models) => {
    Reports.belongsTo(models.User, {
      as: 'reportedBy',
      foreignKey: 'reporterId',
    });
    Reports.belongsTo(models.User, {
      as: 'reportedTo',
      foreignKey: 'reportingId',
    });
  };

  return Reports;
};
