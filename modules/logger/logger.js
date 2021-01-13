/*
'use strict';

//const _set = require('lodash/set');

const LEVELS = {
    INFO: 'info',
    ERROR: 'error'
};

const { createLogger, format, transports } = require('winston');
const ElasticSearch = require('winston-elasticsearch');

//const { combine, timestamp, printf } = format;


/!*const getTodaysDay = ()=>{
       const today = new Date();

       let dd = today.getDate();
       let mm = today.getMonth() + 1;
       let yy = today.getFullYear();

       if(dd<10) dd = '0'+ dd;

       if(mm<10) mm = '0'+ mm;

       return `${dd}-${mm}-${yy}`;

};*!/
/!*
const customFormat = printf(info => {
    const {level, timestamp, message} = info;

    const log = JSON.parse(message);

    _set(log, ['timestamp'], timestamp);
    _set(log, ['level'], level);

    return JSON.stringify(log);
});*!/
const getElasticStyle = format.json(clientInformation => {
    const opts = {
        level: LEVELS.INFO,
        timestamp: new Date().toISOString(),
        meta: clientInformation
    };
    return opts;
});

const logger = createLogger({
    /!*
    format: combine(
        timestamp(),
        customFormat
    ),*!/
    maxsize: 5242880,
    transports: [
        /!*new transports.File({
            filename: `${__dirname}/../../logs/${getTodaysDay()}-logs.log`
        })*!/
        new ElasticSearch(getElasticStyle)
    ]
});

module.exports = logger; */
