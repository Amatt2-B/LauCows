from ultralytics import YOLO
import cv2
import numpy as np

def AvgBrightness(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    sumBrightess = np.sum(hsv[:,:,2])

    w = image.shape[0]
    h = image.shape[1]

    area = w*h

    return sumBrightess / area


def PredBoxes(image):
    if AvgBrightness(image) < 40:
        model = YOLO('../models/bestNight.pt')
        
    else:
        model = YOLO('../models/bestDay.pt')

    preds = model(image, conf=0.6)

    # (1, nBoxes)
    # classes = preds[0].boxes.cls
    # (1, nBoxes)
    # conf = preds[0].boxes.conf

    # (nBoxes, 4)
    # [xCenter, yCenter, width, height] (normalized 0..1)
    boxes = preds[0].boxes.xywhn
    
    return boxes