import sys, json
from keras_pilot import KerasCategorical
from camera import PiCamera
from PIL import Image
import numpy as np

pi_camera = PiCamera()
keras = KerasCategorical()

for line in sys.stdin:
    js = json.loads(line)
    if js['action'] == 'record':
        img = Image.fromarray(np.uint8(pi_camera.getImage()))
        img.save(js['path'])
        print(json.dumps({ "status": "ok", "action": js['action'] }))
    elif js['action'] == 'load_model':
        keras.load(js['model'])
        print(json.dumps({ "status": "ok", "action": js['action'] }))
    elif js['action'] == 'predict':
        print(json.dumps({ "status": "before predict", "action": js['action'] }))
        img = pi_camera.getImage()
        print(json.dumps({ "status": "after image", "action": js['action'] }))
        prediction = keras.run(img)
        print(json.dumps({ 'status': 'prediction', 'steering': prediction[0], 'throttle': prediction[1] }))
    else:
        print(json.dumps({ "status": "unknown" }))