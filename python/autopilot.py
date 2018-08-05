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
        print(json.dumps({ "status": "ok" }))
    elif js['action'] == 'load_model':
        keras.load(js['model'])
        print(json.dumps({ "status": "ok" }))
    elif js['action'] == 'predict':
        prediction = keras.run(pi_camera.getImage())
        print(json.dumps({ 'status': 'prediction', 'steering': prediction[0], 'throttle': prediction[1] }))
    else:
        print(json.dumps({ "status": "unknown" }))