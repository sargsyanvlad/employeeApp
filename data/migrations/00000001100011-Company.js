
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Companies', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    companyLogo: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(50),
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      allowNull: true,
      type: Sequelize.STRING(50),
      validate: {
        len: [6, 30],
      },
    },

    description: {
      allowNull: true,
      type: Sequelize.TEXT,
    },

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

    meta: Sequelize.JSONB,
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
