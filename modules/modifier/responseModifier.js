// const _isArray = require('lodash/isArray');
const _set = require('lodash/set');

module.exports = (ctx) => {
  if ((ctx.status >= 204 && ctx.status < 400) || ctx.status === 405 || ctx.status === 404) return;
  const result = ctx.body;
  const response = {};
  const pagination = {};

  if (Array.isArray(result.data)) {
    _set(pagination, 'limit', parseInt(ctx.request.query.limit, 10));
    // if offset not provided , it should be null,
    // but offset of s3 request is not number  so I can't parse to the request offset
    _set(pagination, 'offset', ctx.request.query.offset);
    _set(pagination, 'total', result.total);
    _set(response, 'pagination', pagination);
  }

  if (result.status) {
    _set(ctx, 'status', result.status);
    delete result.status;
  }
  _set(response, 'data', result.data);
  _set(response, 'meta', result);

  ctx.body = response;
};
