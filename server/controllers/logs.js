import { readFile } from 'fs';
import ServerError from '../utils/ServerError.js';

export default {
    /** @type {import("express").RequestHandler} */
    getLogs: (_, res, next) => {
        readFile('./logs.txt', 'utf8', (err, data) => {
            if (!err) {
                res.set('Content-Type', 'text/plain');
                return res.status(200).send(data);
            }
            
            return next(new ServerError(500, err.message, 'An error occurred reading logs'));
        });
      }
}


