module.exports = (sequelize, DataTypes) => {
  const JobSeekerInterests = sequelize.define(
    'JobSeekerInterests',
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
      interestId: {
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


  return JobSeekerInterests;
};
