/* eslint-disable no-param-reassign */
const { Occupation, sequelize } = require('../../../data/models/index');

const { Op } = sequelize;


module.exports = async (filter, existing) => {
  if (existing && existing.length) {
    existing = existing.map(item => item.id);
  } else { existing = -1; }

  return Occupation.findAll({
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
