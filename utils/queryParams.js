const moment = require('moment');

const parseQueryParams = (params) => {
  const now = moment().format('YYYY-MM-DD');
  let {
    order = '"createdAt" asc', filter, offset, limit, date, groupBy,
  } = params;
  order = order || {};
  date = date || {};
  filter = filter || {};
  const { search = '' } = params;
  order = order.split(',').map(item => item.trim());
  /**
     * filtering
     * * */
  filter = filter || {};
  filter = typeof filter === 'string' ? JSON.parse(filter) : filter;
  const { text = '', key: filterKey } = filter;
  /**
     * filtering
     * * */

  date = typeof date === 'string' ? JSON.parse(date) : date;
  const { from = '1990-01-01', to = now } = date || {};

  offset = offset || 0;
  limit = limit || 1000;
  groupBy = groupBy || 'month';
  /**
     * ordering
     * * */
  // order = typeof order === 'string' ? JSON.parse(order) : order;
  // const { key = 'id', bool = false } = order || { key: 'id', bool: false };
  /**
     * ordering
     * * */

  const final = {
    filter: {
      text,
      key: filterKey,
    },
    offset,
    limit,
    order,
    date: {
      from,
      to,
    },
    groupBy,
  };
  final.search = search;

  return final;
};

module.exports = parseQueryParams;
