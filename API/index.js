

/*
* ############## DEPENDENCIES ##############
* */


const Koa = require('koa');

const { errorLogger } = require('../utils/logger');

const restify = require('./middlewares/index');

const { App, Database } = require('../modules/initializators');
const { serverConfig } = require('../config');

// database instance
const database = new Database({ logging: true });

// application instances
const app = new Koa();
/* f
app.proxy = true;
*/
const server = new App({ database, app });

/**
 * ############## MIDDLEWARES ##############
 */

app.use(require('@koa/cors')());

app.use(restify());
/**
 * ############## ROUTES ##############
 */

require('./routes')(app);

/**
 * ############## RUN SERVER ##############
 */

// logger.info('request', {
//   status: 200,
//   body: JSON.stringify({ a: 1 }),
//   method: 'ctx.req.method',
//   url: 'ctx.req.url',
//   resp: JSON.stringify({ b: 1 }),
// });

errorLogger.error('Response Error', {
  status: 400,
  statusName: 'ex.statusName',
  debug: 'dec',
  exception: JSON.stringify({ a: 1 }),
  body: JSON.stringify({ b: 1 }),
  errMessage: 'ex.details.message',
  method: 'ctx.req.method',
  url: 'ctx.req.url',
  resp: JSON.stringify({ c: 1 }),
});

const { port } = serverConfig;
server.run({ port }).catch((err) => {
  errorLogger.error(err);
});
