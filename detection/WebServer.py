import json
import asyncio
import websockets as ws
import requests as req

# config = {
#     'param1': 1,
#     'param2': True,
#     'param3': 'hello',
#     'param4': ['did', 1, False],
# }

async def OnMessage(msg):
    print(f'message {msg}')
    print(json.loads(msg))

async def OnClose():
    print('closed socket')

async def OnOpen():
    print('openend socket')

async def ConnectSocket():
    while True:
        try: 
            async with ws.connect('ws://localhost:6969') as socket:
                await OnOpen()
                # await socket.send(json.dumps(config))
                
                try:
                    while True:
                        message = await socket.recv()
                        await OnMessage(message)

                except ws.ConnectionClosed:
                    await OnClose()
        
        except Exception as e:
            # print(f'connection failed {e}')
            pass
        
        await asyncio.sleep(2)


def CreateNumCowsEntry(numCows, date):
    try:
        body = {
            'numberCows': numCows,
            'date': date,
        }

        response = req.post('http://127.0.0.1:3001/saveEntry', json=body);
        response.status_code

    except req.exceptions.ConnectionError:
        print('Failed to connect to server')
