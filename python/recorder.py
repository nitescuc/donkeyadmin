import sys, json
from camera import PiCamera
#from datastore import Datastore
from PIL import Image
import numpy as np

pi_camera = PiCamera()
#data_store = Datastore()

for line in sys.stdin:
    js = json.loads(line)
#    if js['base_path'] != '':
#        data_store.set_path(js['base_path'])
#    data_store.save(pi_camera.getImage(), js)
    img = Image.fromarray(np.uint8(pi_camera.getImage()))
    img.save(js['path'])
    print(json.dumps({ "status": "ok" }))