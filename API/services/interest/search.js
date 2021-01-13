const { Interest, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;

/**
 *
 * @param {object} filter
 * @returns {Promise<any>}
 */


module.exports = async filter => Interest.findAll({
  offset: filter.offset,
  limit: filter.limit,
  attributes: ['id', 'name'],
  where: {
    name: {
      [Op.iLike]: `%${filter.search}%`,
    },
  },
});
