import { createClient } from '@libsql/client';

const client = (() => {
    const service = process.env.DB_SERVICE;
    if(service === 'local') {
        const client = createClient({
            url: 'file:cow.db',
        });

        client.execute(
            `CREATE TABLE IF NOT EXISTS cow(
                id INTEGER PRIMARY KEY,
                timestamp_column TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                cows INTEGER DEFAULT 0
            )`
        );
        client.execute(
            `CREATE TABLE IF NOT EXISTS log(
                id INTEGER PRIMARY KEY,
                timestamp_column TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                msg TEXT DEFAULT  ""
            )`
        );

        return client;

    } else if (service === 'turso') {
        return createClient({
            url: process.env.TURSO_DATABASE_URL,
            authToken: process.env.TURSO_AUTH_TOKEN,
        });

    }

    throw new Error('Invalid database service. Should be local or turso');

})();

export default client;
