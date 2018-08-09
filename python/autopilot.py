import sys, json
from keras_pilot import KerasCategorical
from camera import PiCamera
from PIL import Image
import numpy as np
import time

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
        img = pi_camera.getImage()
        start = time.time()
        prediction = keras.run(img)
        print(json.dumps({ 'status': 'prediction', 'steering': float(prediction[0]), 'throttle': float(prediction[1]), 'time': float(time.time() - start) }), flush=True)
    else:
        print(json.dumps({ "status": "unknown" }))