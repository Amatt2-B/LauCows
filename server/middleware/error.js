import logger from '../utils/logger.js';
import ServerError from '../utils/ServerError.js';

/** @type {import('express').ErrorRequestHandler} */
export default (err, req, res, next) => {
    logger.logError(err.message);

    if(err instanceof ServerError) {
        return res.status(err.code).send({
            status: 'failed',
            msg: err.clientMessage,
        });
    }

    return res.status(500).send({
        status: 'failed',
        msg:'An error ocurred with the server.',
    });
}