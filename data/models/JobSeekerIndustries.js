module.exports = (sequelize, DataTypes) => {
  const JobSeekerIndustries = sequelize.define(
    'JobSeekerIndustries',
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      jobSeekerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      industryId: {
        type: DataTypes.INTEGER,
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
      freezeTableName: true,
    },
    {
      timestamps: true,
    },
  );

  return JobSeekerIndustries;
};
