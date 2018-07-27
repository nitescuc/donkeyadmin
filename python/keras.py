import keras
import numpy as np

def linear_unbin(arr):
    b = np.argmax(arr)
    a = b *(2/14) - 1
    return a

class KerasCategorical():
    def load(self, model_path):
        self.model = keras.models.load_model(model_path)

    def run(self, img_arr):
        img_arr = img_arr.reshape((1,) + img_arr.shape)
        angle_binned, throttle = self.model.predict(img_arr)
        angle_unbinned = linear_unbin(angle_binned)
        return angle_unbinned, throttle[0][0]
