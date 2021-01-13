/**
* ############## DEPENDENCIES ##############
*/

const Koa = require('koa');
const restify = require('./middlewares/index');
const { App, Database } = require('../modules/initializators');
const { errorLogger } = require('../utils/logger');
const { adminServerConfig } = require('../config');
const cors = require('@koa/cors');
/**
 * ############## DB INSTANCE ##############
 */
const database = new Database({ logging: true });

/**
 * ############## APP INSTANCE ##############
 */
const app = new Koa();

const server = new App({ database, app });

/**
 * ############## MIDDLEWARE ##############
 */
app.use(cors());

app.use(restify());
/**
 * ############## ROUTES ##############
 */
require('./routes')(app);

const { port } = adminServerConfig;
server.run({ port }).catch((err) => {
  errorLogger.error(err);
});
