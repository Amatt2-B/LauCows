import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import error from './middleware/error.js';
import ServerError from './utils/ServerError.js';

import Pages from './controllers/pages.js';
import Cows from './controllers/cows.js';
import logs from './controllers/logs.js';

const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./dist'))

app.get('/', Pages.getIndex);
app.post('/saveEntry', Cows.saveEntry);
app.get('/numberCows', Cows.numberCows);
app.get('/cowsInRange', Cows.cowsInRange);
app.get('/logs', logs.getLogs);

app.all('*', (req, res, next) => {
    next(new ServerError(404, `Couldn\'t find ${req.originalUrl}`));
})
app.use(error);

export default app;


