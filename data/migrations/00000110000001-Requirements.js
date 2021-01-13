
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requirements', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    generalRequirement: {
      type: Sequelize.STRING,
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
    educationLevel: {
      type: Sequelize.STRING,
    },
    position: {
      type: Sequelize.STRING,
    },
    location: {
      type: Sequelize.GEOMETRY('POINT'),
    },
    duration: {
      type: Sequelize.FLOAT(4),
    },
    jobId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Jobs',
          schema: 'public',
        },
        key: 'id',
      },
      onDelete: 'cascade',
    },
    latitude: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    longitude: {
      type: Sequelize.STRING,
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
