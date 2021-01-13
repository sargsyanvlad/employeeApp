module.exports = (sequelize, DataTypes) => {
  const EmploymentLocation = sequelize.define(
    'EmploymentLocation',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      latitude: {
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      employmentId: {
        type: DataTypes.INTEGER,
      },
    },

    {
      timestamps: true,
    },
  );

  return EmploymentLocation;
};
