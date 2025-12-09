import tensorflow as tf
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten, BatchNormalization

def create_lightweight_model():
    """Create a lightweight face mask detection model"""
    model = Sequential([
        # Block 1
        Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3), padding='same'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        
        # Block 2
        Conv2D(64, (3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        
        # Block 3
        Conv2D(128, (3, 3), activation='relu', padding='same'),
        BatchNormalization(),
        MaxPooling2D(2, 2),
        
        # Dense layers
        Flatten(),
        Dense(256, activation='relu'),
        Dropout(0.5),
        Dense(2, activation='softmax')  # 2 classes: with_mask, without_mask
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def save_tflite_model():
    """Create and save a TensorFlow Lite model"""
    print("Creating lightweight model...")
    model = create_lightweight_model()
    model.summary()
    
    # Create dummy data for model initialization
    dummy_input = np.random.random((1, 224, 224, 3)).astype(np.float32)
    model.predict(dummy_input)
    
    # Save Keras model
    model.save('face_mask_model_simple.h5')
    print("Keras model saved")
    
    # Convert to TensorFlow Lite
    print("Converting to TensorFlow Lite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    # Set input/output specs
    converter.target_spec.supported_types = [tf.float32]
    
    tflite_model = converter.convert()
    
    # Save TFLite model
    tflite_path = 'FaceMaskDetectorApp/app/src/main/assets/face_mask_detection.tflite'
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
    
    print(f"TensorFlow Lite model saved to: {tflite_path}")
    print(f"Model size: {len(tflite_model) / 1024:.2f} KB")
    
    # Also save labels
    labels_path = 'FaceMaskDetectorApp/app/src/main/assets/labels.txt'
    with open(labels_path, 'w') as f:
        f.write('without_mask\n')
        f.write('with_mask\n')
    
    print(f"Labels saved to: {labels_path}")
    print("\nModel created successfully!")
    print("Note: This is a base model. For better accuracy, train on your dataset using train_model.py")

if __name__ == "__main__":
    save_tflite_model()
