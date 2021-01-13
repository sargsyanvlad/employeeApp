const { USER_ROLES } = require('../../utils/constants');
const errorDetails = require('../../utils/errorDetails');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    role: {
      type: Sequelize.STRING,
      validate: {
        isIn: {
          args: [[USER_ROLES.JOBSEEKER, USER_ROLES.COMPANY, USER_ROLES.COMPANY_USER, USER_ROLES.SUPER_ADMIN]],
          msg: errorDetails.UNSUPPORTED_ROLE,
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    avatar: {
      type: Sequelize.STRING,
      required: false,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    position: {
      type: Sequelize.STRING,
    },
    activeDate: {
      type: Sequelize.DATE,
      defaultValue: Date.now(),
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
