import turso from '../database.js';
import ServerError from '../utils/ServerError.js';

import 'dotenv/config';
const roleUser = process.env.TURSO_ROLE_ACCESS;

const logAccess = async (msg) => {
    turso.batch(
        [
            {
                sql: "INSERT INTO log(msg) VALUES (?)",
                args: [msg],
            },
        ],
        "write"
    )
};

export default {
    /** @type {import("express").RequestHandler} */
    saveEntry: (req, res, next) => {
        const numberCows = req.body.numberCows;
        const date = req.body.date || new Date().toLocaleString("sv-SE", {
            timeZone: "America/Mexico_City",
            hour12: false,
        });
        
        turso.batch(
            [
                {
                    sql: "INSERT INTO cow(cows, timestamp_column) VALUES (?, ?)",
                    args: [numberCows, date],
                },
            ],
            "write"
        ).then((result) => {
            logAccess(`Entry written on DataBase with value ${numberCows} and id: ${result[0].lastInsertRowid} as [${roleUser}]`);
            res.status(200).send({
                status:'success', 
                msg:'Entry succesfull written', 
                id: `${result[0].lastInsertRowid}`,
            });

        }).catch((error) => {
            next(new ServerError(500, error.msessage, 'An error occurred while writing to the database'))

        })
    
    },

    /** @type {import("express").RequestHandler} */
    numberCows: (req, res, next) => {
        turso.execute("SELECT * FROM cow")
            .then((result) => {
                logAccess(`Table cow readed as [${roleUser}]`);
                res.status(200).send({status:'success', data: result.rows});
            })
            .catch((error) => {
                next(new ServerError(500, error.message, 'An error occurred while querying the database'));

            })
    },

    /** @type {import("express").RequestHandler} */
    cowsInRange: (req, res, next) => {
        const initialDate = req.query.initialDate;
        const endDate = req.query.endDate;

        turso.execute({
            sql : "SELECT * FROM cow WHERE timestamp_column <= ? AND timestamp_column >= ?",
            args : [endDate, initialDate]

        }).then((result) => {
            logAccess(`Table cow readed as [${roleUser}]`);
            res.status(200).send({status:'success', data: result.rows})
        }).catch((error) => {
            next(new ServerError(500, error.message, 'An error occurred with your query'));

        });

    }
}
