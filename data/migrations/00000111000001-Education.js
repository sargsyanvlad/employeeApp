
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Education', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    school: {
      type: Sequelize.STRING,
    },
    degree: {
      type: Sequelize.STRING,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fieldOfStudy: {
      type: Sequelize.STRING,
    },
    fromYear: {
      type: Sequelize.DATE,
    },
    toYear: {
      type: Sequelize.DATE,
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
    jobSeekerId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'JobSeekers',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    city: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.GEOMETRY('POINT'),
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    longitude: {
      type: Sequelize.STRING,
      allowNull: true,
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
