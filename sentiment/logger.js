const pino = require('pino');

let logger;

if (process.env.NODE_ENV !== 'production') {
    logger = pino({
        level: 'debug',
    });
} else {
    logger = pino();
}

module.exports = logger;
