import winston from 'winston';
import config from './config';
import 'winston-daily-rotate-file';

var pid = process.pid;

var rotatingFileTransport = new winston.transports.DailyRotateFile({
    name: 'mainlog',
    handleExceptions: true,
    filename: './logs',
    datePattern: 'logs/'+pid+'.yyyy-MM-dd.',
    prepend: true,
    maxsize: 200<<20,
    maxFiles: 10,
    json: false, 
    level: config.env.name === 'dev' ? 'debug' : 'info'
});

var consoleTransport = new (winston.transports.Console)({
        json: false, 
        timestamp: true,
        humanReadableUnhandledException: true
    });

var infoFileTransport = new winston.transports.File({ filename: __dirname + '/logs/debug.log', json: false });
var exceptionFileTransport = new winston.transports.File({ filename: __dirname + '/logs/exception.log', json: false });

var logger = new (winston.Logger)({
    transports: config.env.name==='dev'?[rotatingFileTransport, consoleTransport]:[rotatingFileTransport],
    exceptionHandlers: [consoleTransport,exceptionFileTransport],
    exitOnError: true
});

module.exports = logger;
