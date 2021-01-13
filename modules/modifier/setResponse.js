// const httpStatusCodes = require('http-status-codes');
const _set = require('lodash/set');

module.exports = (ctx, result, statusCode) => {
  console.log('====> SetResponse <====');
  // const statusName = httpStatusCodes.getStatusText(statusCode);

  _set(ctx.body, 'status', statusCode);
  ctx.body = result;
};
