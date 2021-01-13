/* eslint-disable no-param-reassign */
const { Industry, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;
/**
 * @param filter
 * @param existing
 * @returns {Promise<any>}
 */


module.exports = async (filter, existing) => {
  if (existing && existing.length) {
    existing = existing.map(item => item.id);
  } else { existing = -1; }

  return Industry.findAll({
    offset: filter.offset,
    limit: filter.limit,
    attributes: ['id', 'name'],
    where: {
      id: {
        [Op.notIn]: existing
      }
    }
  });
};
