# Face Mask Detector - Android App

A real-time Face Mask Detection Android application using TensorFlow Lite and Google ML Kit.

## Features

✅ **Real-time Detection**: Detects face masks in real-time using device camera
✅ **High Accuracy**: Uses TensorFlow Lite optimized model
✅ **Fast Performance**: Optimized for mobile devices
✅ **Modern UI**: Material Design 3 interface
✅ **Easy to Use**: Simple and intuitive user interface
✅ **Play Store Ready**: Follows all Google Play Store guidelines

## Technical Stack

- **Language**: Kotlin
- **ML Framework**: TensorFlow Lite 2.14.0
- **Face Detection**: Google ML Kit Face Detection
- **Camera**: AndroidX CameraX
- **UI**: Material Design Components
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## Project Structure

```
FaceMaskDetectorApp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── assets/
│   │   │   │   ├── face_mask_detection.tflite
│   │   │   │   └── labels.txt
│   │   │   ├── java/com/facemask/detector/
│   │   │   │   ├── MainActivity.kt
│   │   │   │   └── MaskDetector.kt
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   ├── values/
│   │   │   │   └── drawable/
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── proguard-rules.pro
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## How to Build

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 or later
- Android SDK with API Level 34
- Gradle 8.0+

### Build Steps

1. **Open project in Android Studio**
   ```bash
   cd FaceMaskDetectorApp
   ```

2. **Sync Gradle**
   - Open Android Studio
   - File → Open → Select FaceMaskDetectorApp folder
   - Wait for Gradle sync to complete

3. **Create TensorFlow Lite Model**
   ```bash
   cd ..
   python create_simple_model.py
   ```
   This creates a base model. For better accuracy, train on your dataset:
   ```bash
   python train_model.py
   ```

4. **Build APK**
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Or use command line:
   ```bash
   ./gradlew assembleRelease
   ```

5. **Build App Bundle for Play Store**
   ```bash
   ./gradlew bundleRelease
   ```

## Play Store Deployment

### Prerequisites for Play Store

1. **Google Play Console Account** ($25 one-time registration fee)
2. **Signed App Bundle** (AAB file)
3. **App Icon** (512x512 PNG)
4. **Feature Graphic** (1024x500 PNG)
5. **Screenshots** (minimum 2)
6. **Privacy Policy** (required if app uses camera/permissions)

### Steps to Upload

1. **Generate Signing Key**
   ```bash
   keytool -genkey -v -keystore face-mask-detector.jks -keyalg RSA -keysize 2048 -validity 10000 -alias face-mask-key
   ```

2. **Configure Signing in build.gradle**
   Add to `app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file("face-mask-detector.jks")
               storePassword "your_keystore_password"
               keyAlias "face-mask-key"
               keyPassword "your_key_password"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               ...
           }
       }
   }
   ```

3. **Build Signed App Bundle**
   ```bash
   ./gradlew bundleRelease
   ```
   Output: `app/build/outputs/bundle/release/app-release.aab`

4. **Upload to Play Console**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create New App
   - Fill in app details
   - Upload AAB file
   - Add store listing assets
   - Submit for review

## Model Training (Optional)

To improve accuracy, train the model on your dataset:

```bash
python train_model.py
```

This will:
- Load images from "Medical mask" folder
- Train CNN model on face mask data
- Convert to TensorFlow Lite
- Save to `face_mask_detection.tflite`

Copy the generated `.tflite` file to:
```
FaceMaskDetectorApp/app/src/main/assets/
```

## Permissions Required

- **CAMERA**: For real-time face mask detection
- **INTERNET**: For ML Kit model downloads (optional)

## Privacy Policy

Since this app uses camera permission, you must provide a privacy policy URL when publishing to Play Store.

Sample privacy policy:
- Data collected: None (all processing is on-device)
- Camera usage: Only for real-time face detection
- No data is stored or transmitted

## Testing

### On Emulator
1. Create AVD with API 24+
2. Enable camera in AVD settings
3. Run app

### On Physical Device
1. Enable Developer Options
2. Enable USB Debugging
3. Connect device
4. Run app from Android Studio

## Known Issues

- Face detection accuracy depends on lighting conditions
- Works best with frontal faces
- May have reduced accuracy with partial occlusions

## Future Enhancements

- [ ] Add statistics tracking
- [ ] Multiple face detection
- [ ] Save detection screenshots
- [ ] Support for back camera
- [ ] Dark mode support
- [ ] Multi-language support

## License

This project is for educational purposes.

## Support

For issues or questions, please check:
- TensorFlow Lite: https://www.tensorflow.org/lite
- ML Kit: https://developers.google.com/ml-kit
- CameraX: https://developer.android.com/training/camerax

## Credits

- Dataset: Face Mask Detection Dataset
- ML Framework: TensorFlow Lite
- Face Detection: Google ML Kit
- UI: Material Design

---

**Ready for Play Store Upload!** 🚀

Follow the deployment steps above to publish your app.
