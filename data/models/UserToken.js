module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define(
    'UserToken',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
    },
    {
      timestamps: true,
    },
  );
  return UserToken;
};
