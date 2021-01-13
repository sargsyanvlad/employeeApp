const DataTypes = require('sequelize');

const JobSeekerOccupationsSchema = {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  jobSeekerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupationId: {
    type: DataTypes.INTEGER,
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
const JobSeekerOccupationsOptions = {
  timestamps: true,
  freezeTableName: true,
};


module.exports = seq => seq.define('JobSeekerOccupations', JobSeekerOccupationsSchema, JobSeekerOccupationsOptions);
