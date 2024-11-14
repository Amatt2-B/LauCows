from croniter import croniter
from datetime import datetime
import asyncio

async def CreateTask(task, expr):
    cron = croniter(expr, datetime.now())
    while True:
        nextRun = cron.get_next(datetime)
        waitTime = (nextRun - datetime.now()).total_seconds()
        print(f'task {task.__name__}')
        print(f'next run {nextRun}')
        print(f'wait time: {waitTime}')
        await asyncio.sleep(waitTime)
        asyncio.create_task(task())