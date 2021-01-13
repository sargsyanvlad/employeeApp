/*
'use strict';

const LEVELS = {
    INFO: 'info',
    ERROR: 'error'
};

const logger = require('./logger');

const error = (ctx, error)=> {

    const {url, method, ip} = ctx.request;

    const reqBody = ctx.request.body;
    const message = {
        ip,
        method,
        url,
        req:reqBody,
        status: 500,
        resp:{},
        debug: error
    };
    logger.log(LEVELS.ERROR, message)
};

const info = (ctx)=> {
    const {status, body} = ctx;
    const {url, method, ip} = ctx.request;
    const reqBody = ctx.request.body;

    const message = {
        ip,
        method,
        url,
        req:reqBody,
        status,
        resp: body,
        debug: ''
    };
    logger.log(LEVELS.INFO, message);
};

module.exports = {
    error,
    info
}; */
