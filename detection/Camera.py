import cv2

def TakePhoto():
    cam = cv2.VideoCapture(0)
    cam.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
    cam.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)
    cam.set(cv2.CAP_PROP_AUTO_EXPOSURE, -1)

    if not cam.isOpened():
        print('cannot open camera')
        return None

    ret, image = cam.read()

    cam.release()

    if not ret:
        print('can\'t recieve frame')
        return None
    
    return image