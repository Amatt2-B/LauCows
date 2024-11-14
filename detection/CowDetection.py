from ultralytics import YOLO

def PredBoxes(image):
    model = YOLO('../models/bestDay.pt')
    # ModelNight = YOLO('../models/bestNight.pt')

    preds = model(image, conf=0.6)

    # (1, nBoxes)
    # classes = preds[0].boxes.cls
    # (1, nBoxes)
    # conf = preds[0].boxes.conf

    # (nBoxes, 4)
    # [xCenter, yCenter, width, height] (normalized 0..1)
    boxes = preds[0].boxes.xywhn
    
    return boxes