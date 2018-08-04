import os
import sys
import time
import json
import datetime
import random
import glob
import numpy as np
import pandas as pd
from PIL import Image

class Datastore():
    def __init__(self):
        self.current_ix = 0

    def make_file_name(self, key, ext='.png'):
        name = '{:08d}_{}_{}'.format(self.current_ix, key, ext)        
        name = name = name.replace('/', '-')
        return name

    def get_json_record_path(self, ix):
        #return os.path.join(self.path, 'record_'+str(ix)+'.json')
        return os.path.join(self.path,'record_{:08d}.json'.format(ix))

    def write_json_record(self, json_data):
        path = self.get_json_record_path(self.current_ix)
        try:
            with open(path, 'w') as fp:
                json.dump(json_data, fp)
                #print('wrote record:', json_data)
        except TypeError:
            print('troubles with record:', path, json_data)
        except FileNotFoundError:
            raise
        except:
            print("Unexpected error:", sys.exc_info()[0])
            raise

    def set_path(self, base_path):
        self.path = path

    def save(self, image_array, json_data):
        if self.path == '':
            raise 'No path'
        key = 'cam/image_array'
        name = self.make_file_name(key, ext='.jpg')
        img = Image.fromarray(np.uint8(image_array))        
        img.save(os.path.join(self.path, name))
        json_data[key] = name

        self.write_json_record(json_data)

        self.current_ix = self.current_ix + 1