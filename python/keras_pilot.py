import sys, json, os
import keras
import numpy as np
from keras.models import model_from_json

def linear_unbin(arr):
    b = np.argmax(arr)
    a = b *(2/14) - 1
    return a

class KerasCategorical():
    def load(self, model_path):
        if os.path.isfile(model_path + '.json') and os.path.isfile(model_path + '.hd5'):
            print(json.dumps({'status': 'loading from weights'}))
            json_file = open(model_path + '.json', 'r')
            loaded_model_json = json_file.read()
            json_file.close()
            self.model = model_from_json(loaded_model_json)
            self.model.load_weights(model_path + '.hd5')
        else:  
            self.model = keras.models.load_model(model_path)

    def run(self, img_arr):
        img_arr = img_arr.reshape((1,) + img_arr.shape)
        angle_binned, throttle = self.model.predict(img_arr)
        angle_unbinned = linear_unbin(angle_binned)
        return angle_unbinned, throttle[0][0]
