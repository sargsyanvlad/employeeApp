module.exports = (sequelize, DataTypes) => {
  const Employment = sequelize.define(
    'Employment',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      jobTitle: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING,
      },
      startDate: {
        type: DataTypes.DATE,
      },
      endDate: {
        type: DataTypes.DATE,
      },
      present: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      jobSeekerId: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      freezeTableName: false,
    },
    {
      timestamps: true,
    },
  );

  Employment.associate = (models) => {
    Employment.hasMany(models.EmploymentLocation, {
      as: 'location',
      foreignKey: 'employmentId',
    });
  };

  return Employment;
};
