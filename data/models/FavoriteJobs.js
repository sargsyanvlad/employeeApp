module.exports = (sequelize, DataTypes) => {
  const FavoriteJobs = sequelize.define(
    'FavoriteJobs',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      jobId: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'Jobs',
            schema: 'public',
          },
          key: 'id',
        },
        onDelete: 'cascade',
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
    },
    {
      timestamps: true,
    },
  );

  return FavoriteJobs;
};
