const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 6969 });

wss.on('listening', () => {
    console.log('ready fready');
})

wss.on('connection', (socket) => {
    socket.send(JSON.stringify({msg: 'hello baby', lol: 1, bad: false}));
    socket.on('message', (msg, isBinary) => {
        if(isBinary) {
            try {
                console.log(JSON.parse(msg));

            } catch {
                console.log('bad girl');
            }
        } else {
            console.log(msg.toString());
        }
    })
})
