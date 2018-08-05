import sys, json
from camera import PiCamera
#from datastore import Datastore
from PIL import Image
import numpy as np

pi_camera = PiCamera()

for line in sys.stdin:
    js = json.loads(line)
    img = Image.fromarray(np.uint8(pi_camera.getImage()))
    img.save(js['path'])
    print(json.dumps({ "status": "ok" }))