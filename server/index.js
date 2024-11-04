import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from "@libsql/client";
import { readFile, writeFile } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const app = express()

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello Lau!'));

app.post('/saveEntry', async (req, res) => {
    const numberCows = req.body.numberCows;
    const date = req.body.date || new Date().toLocaleString("sv-SE", {
        timeZone: "America/Mexico_City",
        hour12: false,
    });
    try {
        const result = await turso.batch(
            [
              {
                sql: "INSERT INTO cow(cows, timestamp_column) VALUES (?, ?)",
                args: [numberCows, date],
              },
            ],
            "write"
          );
        console.log(`Entry written on DataBase with value ${numberCows} and id: ${result[0].lastInsertRowid}`);
        res.status(200).send({status:'success', msg:'Entry succesfull written', id: `${result[0].lastInsertRowid}` });
    } catch (error) {
        const dateTime = new Date().toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const errorMessage = `[${dateTime}] Error: ${error.message}\n`;
        writeFile('./logs.txt', errorMessage, { flag: 'a+' }, err => {
            if (err) {
                console.error('Failed to write to log file:', err);
            } else {
                console.error(`An error ocurred trying to write the value ${numberCows} at ${dateTime}. See the complete log at /logs`);
            }
        });        
        res.status(500).send({status: 'failed', msg:'An error ocurred with data base'});
    }
});

app.get('/numberCows', async (req, res) => {
    try {
        const result = await turso.execute("SELECT * FROM cow");
        res.status(200).send({status:'success', data: result.rows})
    } catch (error) {
        const dateTime = new Date().toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        const errorMessage = `[${dateTime}] Error: ${error.message}\n`;
        writeFile('./logs.txt', errorMessage, { flag: 'a+' }, err => {
            if (err) {
                console.error('Failed to write to log file:', err);
            } else {
                console.error(`An error ocurred trying to read the data at ${dateTime}. See the complete log at /logs`);
            }
        });
        res.status(500).send({status: 'failed', msg:'An error ocurred with data base'});
    }
});

app.get('/logs', (req, res) => {
    readFile('./logs.txt', 'utf8', (err, data) => {
        if (err) {
            const dateTime = new Date().toLocaleTimeString('es-MX', {
                timeZone: 'America/Mexico_City',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            console.error(`An error occurred trying to read logs at ${dateTime}.`);
            return res.status(500).send({ status: 'failed', msg: 'An error occurred reading logs' });
        }
        res.set('Content-Type', 'text/plain');
        res.status(200).send(data);
    });
});

app.listen(PORT, () => console.log(`App runnig on port ${PORT}`))
