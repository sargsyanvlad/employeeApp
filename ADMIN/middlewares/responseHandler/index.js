/* eslint-disable no-ex-assign */
const { responseModifier, errorModifier } = require('../../../modules/modifier');
const { errorLogger, logger } = require('../../../utils/logger');

module.exports = async (ctx, next) => {
  try {
    await next();
    responseModifier(ctx);
    logger.info('request', {
      status: ctx.response.status,
      body: JSON.stringify(ctx.request.body),
      method: ctx.req.method,
      url: ctx.req.url,
      resp: JSON.stringify(ctx.response.body),
    });
  } catch (ex) {
    const errMessage = ex.details && ex.details.message ? ex.details.message : ex.toString();
    errorLogger.error(errMessage);

    ex = errorModifier(ctx, ex).getError();
    ctx[ex.statusName]({ error: ex });
    if (ex.details && ex.details.status) {
      ctx.response.status = ex.details.status;
      ex.status = ex.details.status;
      delete ex.details.status;
    }
    errorLogger.error('Response Error', {
      status: ex.status,
      statusName: ex.statusName,
      debug: ex.debug,
      exception: JSON.stringify(ex),
      body: JSON.stringify(ctx.request.body),
      errMessage: ex.details.message,
      method: ctx.req.method,
      url: ctx.req.url,
      resp: JSON.stringify(ctx.response.body),
    });
  }
};
