module.exports = (sequelize, DataTypes) => {
  const Education = sequelize.define(
    'Education',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      school: {
        type: DataTypes.STRING,
      },
      degree: {
        type: DataTypes.STRING,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fieldOfStudy: {
        type: DataTypes.STRING,
      },
      fromYear: {
        type: DataTypes.DATE,
      },
      toYear: {
        type: DataTypes.DATE,
      },
      userId: {
        type: DataTypes.INTEGER,
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
      },
      city: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.GEOMETRY('POINT'),
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    {
      timestamps: true,
    },
  );

  return Education;
};
