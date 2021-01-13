const compose = require('koa-compose');
const respond = require('koa-respond');
const koaBody = require('koa-body');

const { HTTP_STATUS_METHODS } = require('../../utils/constants');

const responseHandler = require('./responseHandler');

module.exports = () => compose([
  koaBody(),
  respond({
    statusMethods: HTTP_STATUS_METHODS,
  }),
  responseHandler,
]);
