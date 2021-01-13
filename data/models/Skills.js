const DataTypes = require('sequelize');

const SkillsSchema = {
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
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

const SkillsOptions = {
  timestamps: true,
};

module.exports = (seq) => {
  const model = seq.define('Skills', SkillsSchema, SkillsOptions);

  return model;
};
