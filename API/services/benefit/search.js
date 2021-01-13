const { Benefit, Sequelize } = require('../../../data/models/index');

const { Op } = Sequelize;

/**
 *
 * @param filter
 * @returns {Promise<any>}
 */


module.exports = async filter => Benefit.findAll({
  offset: filter.offset,
  limit: filter.limit,
  where: {
    name: { [Op.iLike]: `%${filter.search}%` },
  },
});
