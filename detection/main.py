import cv2
from datetime import datetime
import asyncio

# import Cloud
import WebServer
import Cron
import CowDetection
import Camera

PHOTO_CRON = '*/5 * * * *' # Every 5 minutes

async def CowPhoto():
    image = Camera.TakePhoto()

    if image is None:
        return

    now = datetime.now()
    currentDatetime = now.strftime('%Y-%m-%d-%H-%M-%S')
    serverDateTime = now.strftime('%Y-%m-%d %H:%M:%S')
    # print('current date & time: ', currentDatetime)

    strCurrDateTime = str(currentDatetime)
    strServerDateTime = str(serverDateTime)

    # filePath='/home/cow1/Documents/Images/%s.jpg' % (strCurrDateTime)
    # fileName = './%s.jpg' % (strCurrDateTime)
    filePath = './lol.jpg'
    fileName = '%s.jpg' % (strCurrDateTime)

    cv2.imwrite(filePath, image)

    # await Cloud.SaveImage(filePath, fileName)

    boxes = CowDetection.PredBoxes(image)
    numCows = boxes.shape[0]
    # print(f'{numCows} cows detected')

    WebServer.CreateNumCowsEntry(numCows, strServerDateTime)


async def Fast():
    while True:
        await CowPhoto()
        await asyncio.sleep(5)

async def main():
    tasks = [
        # asyncio.create_task(Cron.CreateTask(CowPhoto, PHOTO_CRON)),
        asyncio.create_task(Fast()),
        # asyncio.create_task(WebServer.ConnectSocket()),
    ]
    await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())


# lock example
count = 0
countLock = asyncio.Lock()

async def Increment():
    global count

    # Lock the resource and modify it
    async with countLock: 
        count += 1
    
