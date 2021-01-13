const DataTypes = require('sequelize');

const CompanyUsersSchema = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  companyId: {
    type: DataTypes.INTEGER,
    references: {
      model: {
        tableName: 'Companies',
        schema: 'public',
      },
      key: 'id',
    },
    onDelete: 'cascade',
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: {
        tableName: 'Users',
        schema: 'public',
      },
      key: 'id',
    },
    onDelete: 'cascade',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const CompanyUsersOptions = {
  timestamps: true,
  freezeTableName: true,
};


const CompanyUsersAssociation = (models) => {
  models.CompanyUsers.belongsTo(models.Company, {
    as: 'company',
    foreignKey: 'companyId',
  });
};

module.exports = (seq) => {
  const model = seq.define('CompanyUsers', CompanyUsersSchema, CompanyUsersOptions);
  model.associate = CompanyUsersAssociation;
  return model;
};
