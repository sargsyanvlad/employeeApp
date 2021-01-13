module.exports = (sequelize, DataTypes) => {
  const Benefit = sequelize.define(
    'Benefit',
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      url: {
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name', 'url'],
        },
      ],
    },
    {
      timestamps: true,
    },
  );

  Benefit.associate = (models) => {
    Benefit.belongsToMany(models.JobSeeker, {
      through: 'CompanyBenefit',
      as: 'companyBenefit',
      foreignKey: 'benefitId',
    });
  };

  return Benefit;
};
