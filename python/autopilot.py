import sys, json
from keras_pilot import KerasCategorical
from camera import PiCamera

pi_camera = PiCamera()
keras_pilot = KerasCategorical()

for line in sys.stdin:
    js = json.loads(line)
    if js['model']:
        keras_pilot.load(js['model'])
        print(json.dumps({ "status": "ok" }))
    else:
        prediction = keras_pilot.run(pi_camera.getImage())
        print(json.dumps({ 'steering': prediction[0], 'throttle': prediction[1] }))
