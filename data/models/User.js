/* eslint-disable no-underscore-dangle, no-console */
const bcrypt = require('bcrypt');
const errorDetails = require('../../utils/errorDetails');
const { USER_ROLES } = require('../../utils/constants');
const { getDuration } = require('../../utils/helpers');
/**
 *
 * @type {Sequelize}
 */
const DataTypes = require('sequelize');

const UserSchema = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.STRING,
    validate: {
      isIn: {
        args: [[USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER, USER_ROLES.SUPER_ADMIN]],
        msg: errorDetails.UNSUPPORTED_ROLE,
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  avatar: {
    type: DataTypes.STRING,
    required: false,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  position: {
    type: DataTypes.STRING,
  },
  firstName: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  provider: {
    type: DataTypes.STRING,
  },
  providerId: {
    type: DataTypes.STRING,
  },
  activeDate: {
    type: DataTypes.DATE,
    defaultValue: Date.now(),
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  confirmed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  banned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

const UserOptions = {
  getterMethods: {
    online() {
      return getDuration(this.activeDate, Date.now()).asMinutes() < 10;
    },
  },
  timestamps: true,
};

const UserAssociation = (models) => {
  models.User.hasOne(models.JobSeeker, {
    as: 'jobSeeker',
    foreignKey: 'userId',
    hierarchy: true
  });

  models.User.hasOne(models.Company, {
    as: 'Company',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });

  models.User.hasOne(models.CompanyUsers, {
    as: 'companyUser',
    foreignKey: 'UserId',
    onDelete: 'CASCADE',
  });

  models.User.hasMany(models.Job, {
    as: 'job',
    foreignKey: 'userId',
  });

  models.User.hasMany(models.UserToken, {
    as: 'user',
    foreignKey: 'userId',
  });

  models.User.hasMany(models.UserDevices, {
    as: 'userDevices',
    foreignKey: 'userId',
  });

  models.User.hasOne(models.UserNotificationSettings, {
    as: 'notificationSettings',
    foreignKey: 'userId',
  });

  models.User.hasMany(models.UserProviders, {
    as: 'providers',
    foreignKey: 'userId',
  });

  models.User.hasMany(models.Reports, {
    as: 'reports',
    foreignKey: 'reportingId',
  });

  models.User.hasMany(models.BlockedUsers, {
    as: 'blocks',
    foreignKey: 'blockedId',
  });

  models.User.belongsToMany(models.Packages, {
    through: 'UserPackages',
    as: 'packages',
    foreignKey: 'userId',
  });

  models.User.belongsToMany(models.User, {
    through: 'BlockedUsers',
    as: 'blockedUsers',
    foreignKey: 'blockerId',
    otherKey: 'blockedId',
  });
};


module.exports = (seq) => {
  const model = seq.define('User', UserSchema, UserOptions);
  model.prototype.validatePassword = function (candidate = '') {
    return bcrypt.compareSync(candidate, this.password);
  };

  model.prototype.toJSON = function () {
    delete this.dataValues.password;
    this.dataValues.online = this.online;
    return this.dataValues;
  };

  model.associate = UserAssociation;

  return model;
};
