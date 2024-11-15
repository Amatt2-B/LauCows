import { readFile } from 'fs';
import ServerError from '../utils/ServerError.js';

export default {
    /** @type {import('express').RequestHandler} */
    getIndex: (_, res, next) => {
        readFile('./dist/index.html', 'utf-8', (err, html) => {
            if(!err) {
                return res.send(html);
            } 
            
            return next(new ServerError(500, err.message, 'oops we couldn\'t load this page'));
        });
    }
}