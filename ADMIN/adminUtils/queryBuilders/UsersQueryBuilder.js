const { sequelize: { Op } } = require('../../../data/models');

exports.buildQuery = async (queryParams) => {
  const {
    filter: { key = 'firstName', text = '' }, limit, offset, order, date: { from, to }
  } = queryParams;

  let orderData = ['createdAt', 'DESC'];

  if (order) {
    const { key: orderKey, bool: isDesc } = order;
    orderData = [`${orderKey}`, `${isDesc ? 'DESC' : 'ASC'}`];
  }

  const userWhere = {
    createdAt: {
      gte: from,
      lte: to
    }
  };

  const companyWhere = {
    [Op.or]: { name: { ilike: `%${text}%` } }
  };

  if (key === 'email') {
    userWhere[`${key}`] = { ilike: `%${text}%` };
  }

  return {
    companyWhere, userWhere, orderData, limit, offset
  };
};
