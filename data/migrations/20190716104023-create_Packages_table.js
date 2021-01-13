

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Packages', {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    for: {
      type: Sequelize.ENUM,
      values: ['jobSeeker', 'company', 'companyUser'],
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    extraData: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }),
};
