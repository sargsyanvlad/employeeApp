
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Jobs', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    salary: {
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.ENUM,
      values: ['Full-time', 'Part-time', 'Internship', 'Other'],
      validate: {
        isIn: {
          args: [['Full-time', 'Part-time', 'Internship', 'Other']],
          msg: ['type'],
        },
      },
    },
    companyLogo: {
      type: Sequelize.STRING,
    },
    companyName: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    requirementId: {
      type: Sequelize.STRING, // UUID
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
    },
    companyId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Companies',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
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
