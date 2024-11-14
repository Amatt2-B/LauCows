import { writeFile } from 'fs';

const LOG_FILE = './logs.txt';

export default {
    /** @type {(message: string)=>void} */
    logError: (message) => {
        const dateTime = new Date().toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const errorMessage = `[${dateTime}] Error: ${message}\n`;
        
        writeFile(LOG_FILE, errorMessage, { flag: 'a+' }, err => {
            if(err) {
                console.error('Failed to write to log file:', err);
            } else {
                console.error(`[${dateTime}] ERROR. See the detail at /logs`);
            }
        })
        
    }
}

