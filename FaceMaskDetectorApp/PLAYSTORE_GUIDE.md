# Play Store Submission Guide

## Complete Checklist for Play Store Upload

### 1. App Preparation ✓

#### Technical Requirements
- [x] Min SDK: 24 (Android 7.0+)
- [x] Target SDK: 34 (Android 14)
- [x] App Bundle (AAB) format
- [x] Signed with release key
- [x] ProGuard enabled for code optimization
- [x] No security vulnerabilities

#### App Information
- **Package Name**: `com.facemask.detector`
- **Version Code**: 1
- **Version Name**: 1.0.0
- **App Name**: Face Mask Detector

### 2. Signing Configuration

#### Generate Keystore (One-time)
```bash
keytool -genkey -v -keystore face-mask-detector.jks -keyalg RSA -keysize 2048 -validity 10000 -alias face-mask-key
```

#### Information to provide:
- Name: Your Full Name
- Organizational Unit: Your Department
- Organization: Your Company
- City/Locality: Your City
- State/Province: Your State
- Country Code: US (or your country)
- Password: Create a strong password (SAVE THIS!)

#### Update app/build.gradle:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("../face-mask-detector.jks")
            storePassword "YOUR_KEYSTORE_PASSWORD"
            keyAlias "face-mask-key"
            keyPassword "YOUR_KEY_PASSWORD"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release App Bundle

```bash
cd FaceMaskDetectorApp
./gradlew clean
./gradlew bundleRelease
```

Output location: `app/build/outputs/bundle/release/app-release.aab`

### 4. Play Store Assets Required

#### App Icon
- **Size**: 512x512 pixels
- **Format**: PNG (32-bit)
- **No transparency**
- **File size**: < 1MB

#### Feature Graphic
- **Size**: 1024x500 pixels
- **Format**: PNG or JPG
- **No transparency**

#### Screenshots (Minimum 2, Maximum 8 per device type)
##### Phone Screenshots
- **Minimum**: 320px
- **Maximum**: 3840px
- **Aspect Ratio**: 16:9 to 9:16
- **Format**: PNG or JPG

Recommended sizes:
- 1080x1920 (Portrait - Full HD)
- 1080x2280 (Portrait - Modern phones)

##### Tablet Screenshots (Optional but recommended)
- 7-inch: 1200x1920
- 10-inch: 1600x2560

### 5. Store Listing Content

#### Short Description (80 characters max)
```
Real-time face mask detection using AI. Detect masks instantly with your camera.
```

#### Full Description (4000 characters max)
```
Face Mask Detector 😷

Detect face masks in real-time using advanced AI and machine learning technology!

✨ KEY FEATURES:
• Real-time Detection: Instant face mask detection using your device camera
• High Accuracy: Powered by TensorFlow Lite and Google ML Kit
• Fast Performance: Optimized for mobile devices
• Easy to Use: Simple and intuitive interface
• Privacy First: All processing happens on your device

🎯 HOW IT WORKS:
1. Open the app and grant camera permission
2. Point your camera at faces
3. Instantly see if people are wearing masks
4. Get real-time feedback with visual indicators

🔒 PRIVACY & SECURITY:
• No data collection
• All processing is done locally on your device
• No internet connection required for detection
• Camera is only used for real-time detection
• No images or videos are saved

📱 USE CASES:
• Personal safety compliance checking
• Educational purposes
• Workplace safety monitoring
• Public space compliance
• Health and safety awareness

🎨 MODERN DESIGN:
Beautiful Material Design interface with smooth animations and intuitive controls.

⚡ TECHNICAL HIGHLIGHTS:
• TensorFlow Lite for efficient ML processing
• Google ML Kit for accurate face detection
• CameraX for modern camera implementation
• Optimized for battery life

Perfect for businesses, schools, public spaces, or personal use to ensure mask compliance and safety!

Download now and start detecting masks instantly! 🚀

---
PERMISSIONS:
• Camera: Required for real-time face mask detection
• No other permissions required

REQUIREMENTS:
• Android 7.0 or higher
• Device with camera

Support: your-email@example.com
Privacy Policy: your-website.com/privacy
```

#### App Category
Select: **Health & Fitness** or **Tools**

#### Tags (Keywords)
```
face mask, mask detection, covid-19, safety, health, AI, machine learning, camera, real-time detection
```

### 6. Content Rating Questionnaire

Answer these questions on Play Console:

1. **Does your app contain violence?** → No
2. **Does your app contain sexual content?** → No
3. **Does your app contain hate speech?** → No
4. **Does your app simulate gambling?** → No
5. **Does your app contain controlled substances?** → No

Expected Rating: **Everyone** (PEGI 3, ESRB Everyone)

### 7. Privacy Policy (REQUIRED)

You MUST provide a privacy policy URL. Here's a template:

```
PRIVACY POLICY FOR FACE MASK DETECTOR

Last updated: [Current Date]

1. INFORMATION WE DON'T COLLECT
- We do not collect any personal information
- We do not store any images or videos
- We do not track user behavior
- We do not use analytics

2. CAMERA PERMISSION
- Camera is used only for real-time face mask detection
- Images are processed locally on your device
- No images are saved, stored, or transmitted
- All processing happens on-device

3. DATA STORAGE
- No data is stored on our servers
- No user accounts required
- No cloud storage used

4. THIRD-PARTY SERVICES
- Google ML Kit: Used for face detection (privacy policy: https://policies.google.com/privacy)
- No other third-party services

5. CHILDREN'S PRIVACY
- We do not collect information from children under 13

6. CHANGES TO PRIVACY POLICY
- We may update this policy; changes will be posted here

7. CONTACT US
- Email: your-email@example.com

By using this app, you agree to this privacy policy.
```

Host this on:
- GitHub Pages (free)
- Your own website
- Google Sites (free)

### 8. Upload Process

1. **Go to Google Play Console**
   - URL: https://play.google.com/console
   - Sign in with Google account

2. **Create New App**
   - Click "Create app"
   - Enter app name: "Face Mask Detector"
   - Select default language
   - App or game: App
   - Free or paid: Free
   - Accept declarations
   - Click "Create app"

3. **Setup → App Details**
   - Category: Health & Fitness
   - Email: your-email@example.com
   - Phone: (optional)
   - External marketing: No

4. **Setup → Store Listing**
   - Upload all assets (icon, feature graphic, screenshots)
   - Fill in descriptions
   - Add privacy policy URL

5. **Setup → Content Rating**
   - Complete questionnaire
   - Get rating certificate

6. **Setup → Target Audience**
   - Target age: 13+
   - Appeal to children: No

7. **Setup → Data Safety**
   - Data collection: No
   - Share data: No

8.**Release → Production**
   - Create new release
   - Upload AAB file
   - Add release notes
   - Review and rollout

### 9. Release Notes Template

**Version 1.0.0**
```
🎉 Initial Release!

Features:
✅ Real-time face mask detection
✅ Fast and accurate AI detection
✅ Simple, intuitive interface
✅ Privacy-focused (on-device processing)

Thank you for downloading Face Mask Detector!
```

### 10. Pre-Launch Checklist

Before submitting:
- [ ] Test on multiple devices (different Android versions)
- [ ] Test all features work correctly
- [ ] Check camera permission handling
- [ ] Verify app doesn't crash
- [ ] Test in different lighting conditions
- [ ] Verify UI looks good on different screen sizes
- [ ] Check app size is reasonable (< 50MB)
- [ ] Ensure privacy policy is accessible
- [ ] Verify app icon looks good
- [ ] Test on Android 7.0 (minimum SDK)
- [ ] Test on Android 14 (target SDK)

### 11. Common Rejection Reasons (Avoid These)

❌ No privacy policy
❌ Crashes on startup
❌ Missing required permissions explanation
❌ Misleading screenshots
❌ Copyright violations in assets
❌ Security vulnerabilities
❌ Doesn't work as described

### 12. After Submission

- **Review Time**: Usually 1-7 days
- **Status**: Check Play Console regularly
- **Respond Quickly**: If rejected, fix issues and resubmit
- **Monitor**: Check crash reports after launch

### 13. Post-Launch

- Monitor reviews and ratings
- Respond to user feedback
- Fix any reported bugs
- Plan future updates

---

## Quick Commands Summary

```bash
# Generate keystore
keytool -genkey -v -keystore face-mask-detector.jks -keyalg RSA -keysize 2048 -validity 10000 -alias face-mask-key

# Build release AAB
cd FaceMaskDetectorApp
./gradlew bundleRelease

# Output location
# app/build/outputs/bundle/release/app-release.aab
```

## Need Help?

- **Play Console Help**: https://support.google.com/googleplay/android-developer
- **Policy Center**: https://play.google.com/about/developer-content-policy/
- **App Bundle Guide**: https://developer.android.com/guide/app-bundle

---

**Good luck with your Play Store submission!** 🚀
