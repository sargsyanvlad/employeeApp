
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Degree', {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    schema: 'public',
  }),
};
