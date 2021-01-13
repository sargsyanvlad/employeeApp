const DataTypes = require('sequelize');

const OccupationSchema = {
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};
const OccupationOptions = {
  timestamps: true,
  freezeTableName: 'true',
  indexes: [
    {
      unique: true,
      fields: ['name'],
    },
  ],
};


module.exports = seq => seq.define('Occupation', OccupationSchema, OccupationOptions);
