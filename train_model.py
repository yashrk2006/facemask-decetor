import os
import cv2
import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Dropout, Flatten
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.utils import to_categorical
import tensorflow as tf

# Constants
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20

def load_data():
    """Load and preprocess the face mask dataset"""
    print("Loading dataset...")
    df = pd.read_csv('train.csv')
    
    # Filter for only face_with_mask and face_no_mask classes
    df = df[df['classname'].isin(['face_with_mask', 'face_no_mask'])]
    
    images = []
    labels = []
    
    for idx, row in df.iterrows():
        try:
            img_path = os.path.join('Medical mask', 'Medical Mask', row['name'])
            
            if os.path.exists(img_path):
                # Read image
                img = cv2.imread(img_path)
                if img is None:
                    continue
                
                # Extract face region using bounding box
                x1, x2, y1, y2 = int(row['x1']), int(row['x2']), int(row['y1']), int(row['y2'])
                
                # Ensure coordinates are valid
                if x1 >= x2 or y1 >= y2:
                    continue
                
                # Crop face
                face = img[y1:y2, x1:x2]
                
                # Resize to fixed size
                face = cv2.resize(face, (IMG_SIZE, IMG_SIZE))
                
                # Normalize pixel values
                face = face / 255.0
                
                images.append(face)
                
                # Binary classification: 1 for mask, 0 for no mask
                label = 1 if row['classname'] == 'face_with_mask' else 0
                labels.append(label)
                
        except Exception as e:
            print(f"Error processing {row['name']}: {e}")
            continue
        
        # Progress indicator
        if idx % 1000 == 0:
            print(f"Processed {idx} images...")
    
    print(f"Total images loaded: {len(images)}")
    print(f"With mask: {sum(labels)}, Without mask: {len(labels) - sum(labels)}")
    
    return np.array(images), np.array(labels)

def create_model():
    """Create a CNN model for face mask detection"""
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
        MaxPooling2D(2, 2),
        
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D(2, 2),
        
        Flatten(),
        Dense(512, activation='relu'),
        Dropout(0.5),
        Dense(2, activation='softmax')  # 2 classes: with_mask, without_mask
    ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_and_save_model():
    """Train the model and convert to TensorFlow Lite"""
    # Load data
    X, y = load_data()
    
    # Convert labels to categorical
    y = to_categorical(y, num_classes=2)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training set: {len(X_train)}, Test set: {len(X_test)}")
    
    # Data augmentation
    datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2
    )
    
    datagen.fit(X_train)
    
    # Create model
    print("Creating model...")
    model = create_model()
    model.summary()
    
    # Train model
    print("Training model...")
    history = model.fit(
        datagen.flow(X_train, y_train, batch_size=BATCH_SIZE),
        epochs=EPOCHS,
        validation_data=(X_test, y_test),
        verbose=1
    )
    
    # Evaluate model
    test_loss, test_acc = model.evaluate(X_test, y_test)
    print(f"\nTest accuracy: {test_acc:.4f}")
    print(f"Test loss: {test_loss:.4f}")
    
    # Save Keras model
    model.save('face_mask_model.h5')
    print("Keras model saved as 'face_mask_model.h5'")
    
    # Convert to TensorFlow Lite
    print("Converting to TensorFlow Lite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    tflite_model = converter.convert()
    
    # Save TFLite model
    with open('face_mask_detection.tflite', 'wb') as f:
        f.write(tflite_model)
    
    print("TensorFlow Lite model saved as 'face_mask_detection.tflite'")
    
    # Save labels
    labels = ['without_mask', 'with_mask']
    with open('labels.txt', 'w') as f:
        for label in labels:
            f.write(label + '\n')
    
    print("Labels saved as 'labels.txt'")
    
    return model, history

if __name__ == "__main__":
    print("Starting Face Mask Detection Model Training...")
    print("="*50)
    model, history = train_and_save_model()
    print("="*50)
    print("Training complete! TFLite model is ready for Android app.")
