import os
import cv2
import numpy as np
import tensorflow as tf
import sys
from PIL import Image
import io
import gc

# Load the model
script_dir = os.path.dirname(os.path.realpath(__file__))
model_dir = os.path.join(script_dir, '../models/ssd-mobile-net-v2/saved_model')
loaded_model = tf.saved_model.load(model_dir)

def object_detection(img):
    
    # Change RGBA to RGB
    if img.shape[2] == 4:
        img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)

    # Load image
    image_np = np.array(img)

    # Convert image to tensor
    input_tensor = tf.convert_to_tensor(image_np)
    input_tensor = input_tensor[tf.newaxis, ...]

    # Perform detection
    output_dict = loaded_model(input_tensor)
    del input_tensor

    num_detections = int(output_dict.pop('num_detections'))
    output_dict = {key: value[0, :num_detections].numpy()
                for key, value in output_dict.items()}
    output_dict['num_detections'] = num_detections

    output_dict['detection_classes'] = output_dict['detection_classes'].astype(np.int64)

    # Draw the bounding boxes on the image
    for i in range(num_detections):
        if output_dict['detection_scores'][i] > 0.5:  # only keep detections with confidence above 0.5
            ymin, xmin, ymax, xmax = output_dict['detection_boxes'][i]
            (left, right, top, bottom) = (xmin * img.shape[1], xmax * img.shape[1], 
                                        ymin * img.shape[0], ymax * img.shape[0])
            left, right, top, bottom = int(left), int(right), int(top), int(bottom)
            # Draw the bounding box
            cv2.rectangle(img, (left, top), (right, bottom), (0, 255, 0), 2)
    return img
    gc.collect()

if __name__ == '__main__':
    image_data = sys.stdin.buffer.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), -1)
    result_image = object_detection(image)
    result_image = cv2.cvtColor(result_image, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(result_image)
    byte_stream = io.BytesIO()
    pil_image.save(byte_stream,format='JPEG')
    sys.stdout.buffer.write(byte_stream.getvalue())