
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Occupation', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Occupation', { schema: 'public' });
  },
};
