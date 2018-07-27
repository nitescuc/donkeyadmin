import sys, json
from camera import PiCamera
from datastore import Datastore

pi_camera = PiCamera()
data_store = Datastore('/home/pi/d2/data')

for line in sys.stdin:
    js = json.loads(line)
    data_store.save(pi_camera.getImage(), js)
    print(json.dumps({ "status": "ok" }))