# 😷 Face Mask Detector - AI Web App

> Real-Time Face Mask Detection powered by TensorFlow.js

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://facemask-decetor.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.11-orange)](https://www.tensorflow.org/js)

An AI-powered web application that detects face masks in real-time using your webcam. Built with TensorFlow.js and BlazeFace, running 100% in your browser with complete privacy.

![Face Mask Detector](https://via.placeholder.com/800x400/667eea/ffffff?text=Face+Mask+Detector+Demo)

---

## ✨ Features

- 🤖 **AI-Powered Detection** - Real TensorFlow.js models
- 📹 **Real-Time Processing** - 30+ FPS performance
- 🔒 **100% Private** - All processing on-device, no data uploaded
- ⚡ **Fast & Efficient** - Optimized for performance
- 📱 **Responsive Design** - Works on desktop, tablet, mobile
- 🌍 **Works Offline** - After initial load, no internet needed
- 🎨 **Modern UI** - Beautiful Material Design interface

---

## 🚀 Quick Start

### **Try it Live**

👉 **[Launch App](https://facemask-decetor.vercel.app)** 👈

### **Run Locally**

```bash
# Clone the repository
git clone https://github.com/yashrk2006/facemask-decetor.git
cd facemask-decetor

# Start local server
python -m http.server 3000

# Open browser
# Go to: http://localhost:3000
```

That's it! No build process, no dependencies to install - just pure HTML/CSS/JavaScript!

---

## 📂 Project Structure

```
facemask-decetor/
├── index.html              # Main application
├── app.js                  # AI detection logic
├── styles.css              # Modern UI styling
├── README.md              # This file
├── LICENSE                # MIT License
└── vercel.json           # Vercel deployment config
```

---

## 🛠️ How It Works

1. **Camera Access** - Requests permission to use your webcam
2. **Face Detection** - Uses Google's BlazeFace model to detect faces
3. **Mask Classification** - Analyzes face region to detect mask presence
4. **Real-Time Display** - Shows results with bounding boxes and labels
5. **Privacy First** - Everything runs in your browser, no server needed

### **Technology Stack**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI/ML**: TensorFlow.js 4.11, BlazeFace 0.0.7
- **Design**: Material Design principles
- **Deployment**: Vercel

---

## 🎮 Usage

1. **Open the app** in your browser
2. **Click "Start Detection"**
3. **Allow camera access** when prompted
4. **Position your face** in front of camera
5. **See real-time detection** with:
   - Green box = Mask detected ✓
   - Red box = No mask detected ⚠️
   - Live statistics and confidence scores

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Detection Speed | 30+ FPS |
| Inference Time | <100ms |
| Model Size | ~2MB (loaded from CDN) |
| Browser Support | Chrome, Edge, Firefox |
| Mobile Support | ✅ iOS Safari, Android Chrome |

---

## 🌐 Browser Support

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome | ✅ | Recommended |
| Edge | ✅ | Chromium-based |
| Firefox | ✅ | Full support |
| Safari | ✅ | iOS 14.5+ |
| Opera | ✅ | Chromium-based |

---

## 🔒 Privacy & Security

- **No Data Collection** - Your camera feed never leaves your device
- **On-Device Processing** - All AI runs in your browser
- **No Server Upload** - No images or data sent to any server
- **Open Source** - Code is fully transparent and auditable

---

## 🚀 Deployment

### **Deploy to Vercel** (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yashrk2006/facemask-decetor)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### **Deploy to Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Follow prompts
```

### **Deploy to GitHub Pages**

1. Go to repository Settings → Pages
2. Source: Deploy from main branch
3. Folder: / (root)
4. Save and wait 2-3 minutes

Your app will be live at: `https://YOUR_USERNAME.github.io/facemask-decetor/`

---

## 💻 Development

### **Local Development**

```bash
# Option 1: Python server
python -m http.server 3000

# Option 2: Node.js server
npx http-server -p 3000

# Option 3: PHP server
php -S localhost:3000
```

### **HTTPS for Camera (if needed)**

Some browsers require HTTPS for camera access:

```bash
# Using Python
python server_https.py

# Or use ngrok
ngrok http 3000
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
- ⭐ Star this repository

### **How to Contribute**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TensorFlow.js Team** - For the amazing ML framework
- **Google** - For BlazeFace face detection model
- **You** - For using and supporting this project!

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yashrk2006/facemask-decetor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yashrk2006/facemask-decetor/discussions)
- **Email**: yashrk2006@github.com

---

## 🗺️ Roadmap

- [ ] Improve mask detection accuracy
- [ ] Add support for multiple mask types
- [ ] Implement screenshot/recording feature
- [ ] Add statistics dashboard
- [ ] Multi-language support
- [ ] PWA (Progressive Web App) support
- [ ] Dark mode toggle

---

## ⚡ Quick Links

- 🌐 [Live Demo](https://facemask-decetor.vercel.app)
- 📘 [Documentation](https://github.com/yashrk2006/facemask-decetor)
- 🐛 [Report Issues](https://github.com/yashrk2006/facemask-decetor/issues)
- ⭐ [Star on GitHub](https://github.com/yashrk2006/facemask-decetor)

---

<div align="center">

**Made with ❤️ using TensorFlow.js**

[⭐ Star](https://github.com/yashrk2006/facemask-decetor) • [🐛 Report Bug](https://github.com/yashrk2006/facemask-decetor/issues) • [💡 Request Feature](https://github.com/yashrk2006/facemask-decetor/issues)

</div>

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yashrk2006/facemask-decetor?style=social)
![GitHub forks](https://img.shields.io/github/forks/yashrk2006/facemask-decetor?style=social)
![GitHub issues](https://img.shields.io/github/issues/yashrk2006/facemask-decetor)
![GitHub license](https://img.shields.io/github/license/yashrk2006/facemask-decetor)

---

**🚀 Ready to detect face masks with AI? [Launch the app now!](https://facemask-decetor.vercel.app)**
