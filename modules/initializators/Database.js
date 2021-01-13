/* eslint-disable class-methods-use-this */
const { sequelize } = require('../../data/models');
const { logger } = require('../../utils/logger');

class Database {
  constructor(logging = true) {
    this.logging = logging;
  }

  async init() {
    await sequelize.authenticate();

    logger.info('Admin Service Connected to postgres SQL database:');

    // await sequelize.sync({
    //   logging: true,
    // });
  }
}

module.exports = Database;
