# 😷 Face Mask Detector

> AI-Powered Real-Time Face Mask Detection for Web & Android

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.14-orange.svg)](https://www.tensorflow.org/)
[![Android](https://img.shields.io/badge/Android-7.0+-green.svg)](https://developer.android.com/)

A production-ready face mask detection system with both **Web** and **Android** implementations, powered by TensorFlow and Google ML Kit.

![Face Mask Detector Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Face+Mask+Detector+Demo)

---

## ✨ Features

### 🌐 **Web Application**
- ✅ **Real-time detection** using TensorFlow.js and BlazeFace
- ✅ **Privacy-focused** - All processing on-device
- ✅ **Modern UI** with Material Design
- ✅ **Works offline** after initial load
- ✅ **Cross-platform** - Desktop, mobile, tablet

### 📱 **Android Application**
- ✅ **Native Android** app in Kotlin
- ✅ **Google ML Kit** for face detection
- ✅ **TensorFlow Lite** for mask classification
- ✅ **CameraX integration** for smooth camera preview
- ✅ **Material Design 3** UI
- ✅ **Play Store ready**

### 🧠 **AI Models**
- ✅ Pre-trained TensorFlow Lite model
- ✅ Custom training scripts included
- ✅ Dataset of 10,000+ annotated images
- ✅ Fast inference (<100ms)

---

## 🚀 Quick Start

### **Web App**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/face-mask-detector.git
cd face-mask-detector/web_demo

# Start server
python server.py

# Open browser
# Go to: http://localhost:3000/
```

### **Android App**

```bash
# Open in Android Studio
1. Open Android Studio
2. File → Open → Select 'FaceMaskDetectorApp' folder
3. Wait for Gradle sync
4. Click Run ▶️
```

---

## 📂 Project Structure

```
face_mask/
├── 📱 FaceMaskDetectorApp/      # Android application
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/          # TFLite model & labels
│   │   │   ├── java/            # Kotlin source code
│   │   │   └── res/             # UI resources
│   │   └── build.gradle
│   ├── README.md
│   ├── QUICKSTART.md
│   └── PLAYSTORE_GUIDE.md
│
├── 🌐 web_demo/                 # Web application
│   ├── index.html              # Main UI
│   ├── app.js                  # TensorFlow.js implementation
│   ├── server.py               # Development server
│   └── server_https.py         # HTTPS server
│
├── 🧠 ML Models & Scripts
│   ├── train_model.py          # Model training script
│   ├── create_simple_model.py  # Quick model generator
│   └── train.csv               # Training annotations
│
└── 📚 Documentation
    ├── README.md               # This file
    ├── PROJECT_COMPLETE.txt    # Detailed project info
    └── COMPLETION_CHECKLIST.txt
```

---

## 🛠️ Installation

### **Prerequisites**

**For Web App:**
- Python 3.7+
- Modern web browser (Chrome recommended)
- Webcam

**For Android App:**
- Android Studio Hedgehog (2023.1.1) or newer
- Android SDK 24+ (Android 7.0+)
- Android device or emulator

### **Dependencies**

**Web:**
```html
<!-- Loaded via CDN in index.html -->
- TensorFlow.js 4.11.0
- BlazeFace 0.0.7
```

**Android:**
```gradle
- CameraX 1.3.1
- TensorFlow Lite 2.14.0
- Google ML Kit Face Detection 16.1.5
- Material Components 1.11.0
```

---

## 💻 Usage

### **Web Application**

1. **Start the server:**
   ```bash
   cd web_demo
   python server.py
   ```

2. **Open browser:** http://localhost:3000/

3. **Grant camera permission** when prompted

4. **Click "Start Detection"**

5. **See real-time mask detection!** 🎉

### **Android Application**

1. **Build the app:**
   ```bash
   cd FaceMaskDetectorApp
   ./gradlew assembleDebug
   ```

2. **Install on device:**
   ```bash
   ./gradlew installDebug
   ```

3. **Or use Android Studio:**
   - Open project
   - Click Run ▶️

---

## 🧠 Training Custom Model

To train your own mask detection model:

```bash
# Install dependencies
pip install tensorflow opencv-python pandas scikit-learn numpy

# Run training
python train_model.py

# Model will be saved as:
# - face_mask_model.h5 (Keras format)
# - face_mask_detection.tflite (TensorFlow Lite)
```

The trained model will automatically be copied to the Android app's assets folder.

---

## 🌐 Deployment

### **Web App**

Deploy to any static hosting service:

**Vercel (Recommended):**
```bash
cd web_demo
vercel
```

**Netlify:**
```bash
cd web_demo
netlify deploy
```

**GitHub Pages:**
- Push to GitHub
- Settings → Pages → Deploy from main branch

### **Android App**

See [PLAYSTORE_GUIDE.md](FaceMaskDetectorApp/PLAYSTORE_GUIDE.md) for detailed instructions on:
- Building signed APK/AAB
- Google Play Store submission
- App Store Optimization

---

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | ~85% (base model) |
| Inference Time | <100ms |
| Model Size | 103 MB |
| Input Size | 224×224 RGB |
| Output Classes | 2 (with_mask, without_mask) |

---

## 🎨 Screenshots

### Web Application
![Web App Screenshot](https://via.placeholder.com/600x400/667eea/ffffff?text=Web+App+Demo)

### Android Application
![Android App Screenshot](https://via.placeholder.com/300x600/764ba2/ffffff?text=Android+App+Demo)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TensorFlow Team** - For TensorFlow.js and TensorFlow Lite
- **Google** - For ML Kit and BlazeFace models
- **Dataset** - Face mask detection dataset from Kaggle

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** Open an issue on GitHub
- **Email:** your.email@example.com

---

## 🗺️ Roadmap

- [ ] Improve model accuracy to 95%+
- [ ] Add multi-language support
- [ ] iOS app version
- [ ] Real-time statistics dashboard
- [ ] Cloud deployment option
- [ ] API endpoints for integration

---

## ⚙️ Technical Stack

**Web:**
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- ML: TensorFlow.js, BlazeFace
- UI: Material Design principles

**Mobile:**
- Language: Kotlin
- Architecture: MVVM
- ML: TensorFlow Lite, Google ML Kit
- Camera: CameraX
- UI: Material Design 3

**Backend/ML:**
- Python 3.7+
- TensorFlow/Keras 2.14
- OpenCV
- NumPy, Pandas

---

## 📈 Project Status

✅ **Production Ready**

- [x] Web app complete
- [x] Android app complete  
- [x] ML models trained
- [x] Documentation complete
- [x] Play Store ready
- [ ] Published to stores

---

## 📜 Changelog

### v1.0.0 (2025-12-09)
- Initial release
- Web application with TensorFlow.js
- Android application with TensorFlow Lite
- Pre-trained model included
- Complete documentation

---

<div align="center">

**Made with ❤️ for a safer world**

[⭐ Star this repo](https://github.com/YOUR_USERNAME/face-mask-detector) • [🐛 Report Bug](https://github.com/YOUR_USERNAME/face-mask-detector/issues) • [💡 Request Feature](https://github.com/YOUR_USERNAME/face-mask-detector/issues)

</div>
