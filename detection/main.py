import cv2
from datetime import datetime
import asyncio
import websockets as ws
import json as jsml

# lock example
count = 0
countLock = asyncio.Lock()

async def Increment():
    global count

    # Lock the resource and modify it
    async with countLock: 
        count += 1
    

async def TakePhoto():
    while True:
        print('Take photo and upload it to cloud')
        await asyncio.sleep(5)


async def RunModel():
    while True:
        print('Run vision model')
        await asyncio.sleep(2)

config = {
    'param1': 1,
    'param2': True,
    'param3': 'hello',
    'param4': ['did', 1, False],
}

async def OnMessage(msg):
    print(f'message {msg}')
    print(jsml.loads(msg))


async def OnClose():
    print('closed socket')

async def OnOpen():
    print('openend socket')

async def connect():
    while True:
        try: 
            async with ws.connect('ws://localhost:6969') as socket:
                await OnOpen()
                await socket.send(jsml.dumps(config))
                
                try:
                    while True:
                        message = await socket.recv()
                        await OnMessage(message)

                except ws.ConnectionClosed:
                    await OnClose()
        
        except Exception as e:
            print(f'connection failed {e}')
        
        await asyncio.sleep(2)

async def main():
    tasks = [
        asyncio.create_task(TakePhoto()),
        asyncio.create_task(RunModel()),
        asyncio.create_task(connect()),
    ]
    await asyncio.gather(*tasks)

# asyncio.run(connect())

if __name__ == '__main__':
    asyncio.run(main())



# cam = cv2.VideoCapture(0)
# # cam.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
# # cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
# cam.set(cv2.CAP_PROP_FRAME_WIDTH, 900)
# cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 600)
# cam.set(cv2.CAP_PROP_AUTO_EXPOSURE, -1)

# if not cam.isOpened():
#     print('cannot open camera')
#     exit()

# ret, image = cam.read()

# cv2.imwrite('./lol.jpg', image)

# while True:
#     ret, image = cam.read()
#     image = cv2.flip(image, 1)
#     cv2.imshow('Imagetest', image)
#     key = cv2.waitKey(1) & 0xFF
#     if key == 27: # Esc key
#         break

#     if cv2.getWindowProperty('Imagetest', cv2.WND_PROP_VISIBLE) < 1:
#         break

# if not ret:
#     print('can\'t recieve frame')
#     exit()

# currentDatetime = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
# print('current date & time: ', currentDatetime)

# strCurrDateTime = str(currentDatetime)

# # fileName='/home/cow1/Documents/Images/%s.jpg' % (strCurrDateTime)
# fileName = './%s.jpg' % (strCurrDateTime)
# fileNameShort = '%s.jpg' % (strCurrDateTime)

# cv2.imwrite(fileName, image)

# cam.release()

''' GOOGLE SHIT
from googleapiclient.http import MediaFileUpload
from Google import Create_Service

CLIENT_SECRET_FILE = 'Cow_pictures_acct1.json'

API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

folder_id = '1I8LoGjLNV4f5sAreAfAxqsLJHiKVNPIP'

# Upload a file
file_metadata = {
    'name': file_name_short,
    #'parents': [{'id':'I8LoGjLNV4f5sAreAfAxqsLJHiKVNPIP'}]
    'parents': [folder_id]
    }

media_content = MediaFileUpload(file_name, mimetype='image/jpeg')

file = service.files().create(
    body=file_metadata,
    media_body=media_content,
    fields = 'id'
).execute()
print(file)
'''
