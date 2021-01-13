const DataTypes = require('sequelize');

const CompanySchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  companyLogo: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING(50),
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING(50),
    validate: {
      len: [6, 30],
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  jobsCreated: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  jobPostingHave: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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
  meta: DataTypes.JSONB,
};


const CompanyOptions = {
  timestamps: true,
};

const CompanyAssociation = (models) => {
  models.Company.belongsToMany(models.User, {
    through: 'CompanyUsers',
    as: 'companyUsers',
    foreignKey: 'companyId',
  });

  models.Company.belongsToMany(models.Industry, {
    through: 'CompanyTypes',
    as: 'type',
    sourceKey: 'id',
    foreignKey: 'companyId',
    otherKey: 'industryId',
  });

  models.Company.hasMany(models.CompanyPackages, {
    as: 'CompanyPackages',
    foreignKey: 'companyId',
    sourceKey: 'id',
  });

  models.Company.belongsToMany(models.Benefit, {
    through: 'CompanyBenefit',
    as: 'benefits',
    foreignKey: 'companyId',
    otherKey: 'BenefitId',
  });
};

module.exports = (seq) => {
  const model = seq.define('Company', CompanySchema, CompanyOptions);
  model.associate = CompanyAssociation;
  return model;
};
