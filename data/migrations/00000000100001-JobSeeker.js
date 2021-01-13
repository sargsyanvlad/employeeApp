const errorDetails = require('../../utils/errorDetails');
const { USER_GENDERS } = require('../../utils/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('JobSeekers', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING(50),
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING(50),
    },
    gender: {
      type: Sequelize.ENUM,
      values: [USER_GENDERS.MALE, USER_GENDERS.FEMALE, USER_GENDERS.OTHER],
      validate: {
        isIn: {
          args: [[USER_GENDERS.MALE, USER_GENDERS.FEMALE, USER_GENDERS.OTHER]],
          msg: errorDetails.INVALID_GENDER,
        },
      },
    },
    phone: {
      allowNull: true,
      type: Sequelize.STRING(50),
      validate: {
        len: [6, 30],
      },
    },
    about: {
      type: Sequelize.TEXT,
    },
    facebookId: Sequelize.STRING,
    linkedInId: Sequelize.STRING,
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
      allowNull: false,
    },
    provider: Sequelize.STRING,
    meta: Sequelize.JSONB,
    docs: Sequelize.JSONB,
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    locationPoint: {
      type: Sequelize.GEOMETRY('POINT'),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    schema: 'public',
  }),
};
