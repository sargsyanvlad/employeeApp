/* eslint-disable no-param-reassign */
const { Benefit, sequelize: { Op } } = require('../../../data/models/index');

module.exports = async (filter, existing) => {
  if (existing && existing.length) {
    existing = existing.map(item => item.id);
  } else { existing = -1; }

  return Benefit.findAll({
    offset: filter.offset,
    limit: filter.limit,
    order: [['createdAt', 'asc']],
    where: {
      id: {
        [Op.notIn]: existing
      }
    }
  });
};
