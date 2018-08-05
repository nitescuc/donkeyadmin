import sys, json
import keras
import numpy as np

def linear_unbin(arr):
    b = np.argmax(arr)
    a = b *(2/14) - 1
    return a

class KerasCategorical():
    def load(self, model_path):
        print(json.dumps({'status', 'into load model'}))
        self.model = keras.models.load_model(model_path)

    def run(self, img_arr):
        print(json.dumps({'status', 'into run'}))
        img_arr = img_arr.reshape((1,) + img_arr.shape)
        print(json.dumps({'status', 'before predict'}))
        angle_binned, throttle = self.model.predict(img_arr)
        print(json.dumps({'status', 'after predict'}))
        angle_unbinned = linear_unbin(angle_binned)
        print(json.dumps({'status', 'after unbin'}))
        return angle_unbinned, throttle[0][0]
