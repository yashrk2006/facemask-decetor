# 🔧 Camera Permission Troubleshooting Guide

## ❌ Problem: "Camera access denied" Error

Even though you clicked "Allow", the camera still doesn't work.

---

## ✅ **QUICK FIXES** (Try in order):

### **Fix 1: Hard Refresh the Page**
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### **Fix 2: Check Browser Camera Settings**

#### **Chrome/Edge:**
1. Click the **🔒 lock icon** (or ⓘ) in address bar (left of URL)
2. Find "Camera" setting
3. Change to **"Allow"** (not "Ask")
4. Close the popup
5. **Refresh page** (F5)
6. Click "Start Detection" again

#### **Firefox:**
1. Click **🔒 lock icon** in address bar
2. Click **">"** arrow next to "Connection secure"
3. Click **"More Information"**
4. Go to **"Permissions"** tab  
5. Find "Use the Camera"
6. Uncheck "Use Default"
7. Select **"Allow"**
8. Close window
9. **Refresh page** (F5)

###Fix 3: Clear Site Data & Reset**
1. **Chrome:** 
   - Go to `chrome://settings/content/camera`
   - Find `localhost:3000` under "Blocked" or "Allowed"
   - Click **trash icon** to remove it
   - Go back to http://localhost:3000/
   - Click "Start Detection" → Allow when asked

2. **Firefox:**
   - Go to `about:preferences#privacy`
   - Click "Settings" next to Camera
   - Find `localhost` and remove it
   - Refresh http://localhost:3000/

### **Fix 4: Check If Camera Is Busy**

Close these apps if running:
- ✅ Zoom, Skype, Microsoft Teams, Discord
- ✅ OBS, Streamlabs, recording software
- ✅ Windows Camera app
- ✅ Other browser tabs/windows using camera
- ✅ Virtual camera software

**How to check:**
- Windows: Open Task Manager → Look for camera apps
- Check Windows Settings → Privacy → Camera → See which apps are using camera

### **Fix 5: Restart Browser**
1. **Close ALL browser windows** (not just the tab)
2. Reopen browser
3. Go to http://localhost:3000/
4. Try again

### **Fix 6: Try Different Browser**

**Works best:**
- ✅ Google Chrome (best compatibility)
- ✅ Microsoft Edge (Chromium)
- ⚠️ Firefox (may need extra steps)
- ❌ Safari (may not work on localhost)

### **Fix 7: Use HTTPS Instead of HTTP**

Some browsers require HTTPS for camera access.

**Run the HTTPS server:**
```bash
cd web_demo
python server_https.py
```

Then go to: **https://localhost:3443/**

You'll see a security warning:
1. Click **"Advanced"**
2. Click **"Proceed to localhost (unsafe)"**
3. Now camera should work!

---

## 🔍 **DIAGNOSIS:**

### **What browser are you using?**
- Chrome → Should work easily
- Firefox → May need permissions reset
- Edge → Should work like Chrome
- Safari → Try Chrome instead

### **What error do you see in console?**

Press **F12** → Go to **"Console"** tab

Look for error message:
- `NotAllowedError` → Permission denied (try Fix 1-3)
- `NotFoundError` → No camera detected (check hardware)
- `NotReadableError` → Camera in use (close other apps)
- `SecurityError` → Need HTTPS (try Fix 7)

---

## 🎯 **RECOMMENDED SOLUTION:**

**The most reliable way:**

1. **Use Google Chrome browser**
2. **Run HTTPS server:**
   ```bash
   cd c:\Users\kushw\OneDrive\Desktop\face_mask\web_demo
   python server_https.py
   ```
3. **Go to:** https://localhost:3443/
4. **Click "Advanced" → "Proceed to localhost"**
5. **Click "Start Detection"**
6. **Click "Allow" for camera**
7. **Should work!** ✓

---

## 📞 **Still Not Working?**

### Check these:
1. ✅ Do you have a working webcam?
   - Test in Windows Camera app
   - Test on https://webcamtests.com/

2. ✅ Is webcam enabled in BIOS/System?
   - Some laptops have hardware camera disable

3. ✅ Antivirus/Firewall blocking camera?
   - Temporarily disable to test

4. ✅ Privacy settings blocking camera?
   - Windows Settings → Privacy → Camera
   - Make sure "Allow apps to access camera" is ON

---

## 💡 **BROWSER CONSOLE COMMANDS:**

Open browser console (F12) and run:

```javascript
// Check if camera API is available
console.log('getUserMedia available:', !!navigator.mediaDevices?.getUserMedia);

// List available cameras
navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        const cameras = devices.filter(d => d.kind === 'videoinput');
        console.log('Cameras found:', cameras.length);
        cameras.forEach(c => console.log('  -', c.label || 'Unknown Camera'));
    });

// Try to access camera directly
navigator.mediaDevices.getUserMedia({ video: true })
    .then(() => console.log('✓ Camera access works!'))
    .catch(err => console.error('❌ Camera error:', err.name, err.message));
```

---

## 🚀 **NEXT STEPS:**

After fixing camera:
1. Reload http://localhost:3000/
2. Click "Start Detection"
3. Allow camera when prompted
4. See AI face detection in action! 🎉

---

**Current Server:** http://localhost:3000/  
**HTTPS Alternative:** https://localhost:3443/  

**Need more help?** Check browser console (F12) for specific error messages!
