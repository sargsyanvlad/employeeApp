module.exports = (sequelize, DataTypes) => {
  const FavoriteJobSeekers = sequelize.define(
    'FavoriteJobSeekers',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
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
        references: {
          model: {
            tableName: 'JobSeekers',
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

  return FavoriteJobSeekers;
};
