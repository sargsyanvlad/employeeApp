const winston = require('winston');
const elasticsearch = require('elasticsearch');
const Elasticsearch = require('winston-elasticsearch/index');

const client = new elasticsearch.Client({
  host: process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'admin' ? 'localhost:9200' : 'http://3.91.75.143:9200',
  // host: 'http://3.91.75.143:9200',
  log: 'info',
});

const esTransportOpts1 = {
  level: 'info',
  index: 'log_info',
  client,
};

const esTransportOpts2 = {
  level: 'error',
  index: 'log_error',
  client,
};

exports.logger = winston.createLogger({
  transports: [
    new Elasticsearch(esTransportOpts1),
  ],
});

exports.errorLogger = winston.createLogger({
  transports: [
    new Elasticsearch(esTransportOpts2),
  ],
});
