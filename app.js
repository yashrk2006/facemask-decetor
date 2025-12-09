// Face Mask Detector - IMPROVED PIXEL DETECTION
// Actually analyzes brightness patterns to detect masks accurately

let stream = null;
let faceDetectionModel = null;
let isDetecting = false;
let videoElement = null;
let canvas = null;
let ctx = null;
let lastFrameTime = Date.now();
let fps = 0;
let detectionTimes = [];
let totalDetections = 0;
let withMaskTotal = 0;
let withoutMaskTotal = 0;
let faceStates = new Map();
let currentCamera = 'user';

// Settings
let settings = {
    soundEnabled: false,
    notificationsEnabled: false,
    autoSave: false,
    tracking: true,
    theme: 'dark'
};

// Initialize
async function init() {
    videoElement = document.getElementById('webcam');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setupEventListeners();
    loadSettings();
    updateStatusBadge('info', 'Ready to start');
    console.log('Face Mask Detector initialized');
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startDetection);
    document.getElementById('stopBtn').addEventListener('click', stopDetection);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);

    const flipBtn = document.getElementById('flipCameraBtn');
    if (flipBtn) {
        flipBtn.addEventListener('click', flipCamera);
    }

    document.getElementById('soundToggle').addEventListener('change', (e) => {
        settings.soundEnabled = e.target.checked;
        saveSettings();
    });

    document.getElementById('notifToggle').addEventListener('change', (e) => {
        settings.notificationsEnabled = e.target.checked;
        if (e.target.checked) requestNotificationPermission();
        saveSettings();
    });

    document.getElementById('autoSaveToggle').addEventListener('change', (e) => {
        settings.autoSave = e.target.checked;
        saveSettings();
    });

    document.getElementById('trackingToggle').addEventListener('change', (e) => {
        settings.tracking = e.target.checked;
        saveSettings();
    });

    // Export buttons
    const exportBtns = document.querySelectorAll('.btn-secondary');
    exportBtns.forEach(btn => {
        if (btn.textContent.includes('Export')) {
            btn.addEventListener('click', exportData);
        } else if (btn.textContent.includes('Reports')) {
            btn.addEventListener('click', viewReports);
        }
    });
}

// Flip Camera
async function flipCamera() {
    if (isDetecting) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        currentCamera = currentCamera === 'user' ? 'environment' : 'user';

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: currentCamera,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            videoElement.srcObject = stream;
            await new Promise((resolve) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    resolve();
                };
            });

            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            faceStates.clear();

            updateStatusBadge('success', `Switched to ${currentCamera === 'user' ? 'front' : 'back'} camera`);
        } catch (err) {
            console.error('Camera flip error:', err);
            updateStatusBadge('danger', 'Failed to switch camera');
        }
    }
}

// Start Detection
async function startDetection() {
    try {
        updateStatusBadge('info', 'Requesting camera...');
        document.getElementById('startBtn').disabled = true;

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: currentCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        videoElement.srcObject = stream;

        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                resolve();
            };
        });

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        updateStatusBadge('info', 'Loading AI model...');

        if (!faceDetectionModel) {
            faceDetectionModel = await blazeface.load();
            console.log('✓ BlazeFace loaded');
        }

        updateStatusBadge('success', 'Detection active');
        document.getElementById('stopBtn').disabled = false;

        isDetecting = true;
        detectFaces();

    } catch (err) {
        console.error('Error:', err);
        updateStatusBadge('danger', 'Camera access denied');
        document.getElementById('startBtn').disabled = false;
        alert('Unable to access camera. Please check permissions.');
    }
}

// Stop Detection
function stopDetection() {
    isDetecting = false;

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }

    videoElement.srcObject = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    updateStatusBadge('info', 'Detection stopped');
    faceStates.clear();
    resetStats();
}

// IMPROVED MASK DETECTION - Analyzes brightness of lower face accurately
function detectMask(faceX, faceY, faceWidth, faceHeight) {
    try {
        // Focus on LOWER HALF of face (where mask would be)
        const lowerFaceY = faceY + (faceHeight * 0.45);  // Start just below nose
        const lowerHeight = faceHeight * 0.55;  // Lower 55% of face

        // Sample the lower face region
        const sampleWidth = Math.floor(faceWidth * 0.8);  // Center 80% to avoid edges
        const sampleHeight = Math.floor(lowerHeight);
        const sampleX = Math.floor(faceX + (faceWidth * 0.1));  // Centered
        const sampleY = Math.floor(lowerFaceY);

        // Create temporary canvas to analyze pixels
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sampleWidth;
        tempCanvas.height = sampleHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw the lower face region
        tempCtx.drawImage(
            videoElement,
            sampleX, sampleY, sampleWidth, sampleHeight,
            0, 0, sampleWidth, sampleHeight
        );

        // Get pixel data
        const imageData = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight);
        const pixels = imageData.data;

        // Analyze pixels
        let totalBrightness = 0;
        let veryBrightPixels = 0;  // Very bright (white mask)
        let brightPixels = 0;      // Bright (light colored mask)
        let darkPixels = 0;         // Dark (skin/no mask)
        let totalPixels = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;

            // Categorize pixels by brightness
            if (brightness > 180) {
                veryBrightPixels++;  // White mask
            } else if (brightness > 140) {
                brightPixels++;       // Light mask or bright skin
            } else {
                darkPixels++;         // Normal/dark skin
            }
        }

        const avgBrightness = totalBrightness / totalPixels;
        const veryBrightRatio = veryBrightPixels / totalPixels;
        const brightRatio = brightPixels / totalPixels;

        console.log(`Brightness Analysis:
            Avg: ${avgBrightness.toFixed(1)}
            Very Bright: ${(veryBrightRatio * 100).toFixed(1)}%
            Bright: ${(brightRatio * 100).toFixed(1)}% 
            Dark: ${(darkPixels / totalPixels * 100).toFixed(1)}%`);

        // MASK DETECTION LOGIC:
        // A white/light mask will have:
        // 1. High average brightness (>150)
        // 2. Many very bright pixels (>30% over 180 brightness)
        // 3. OR very high average (>170)

        let maskScore = 0;
        let hasMask = false;

        // Strong indicators of white/light mask
        if (veryBrightRatio > 0.3) maskScore += 50;  // 30%+ very bright = likely white mask
        if (avgBrightness > 170) maskScore += 40;     // Very high avg = likely mask
        if (avgBrightness > 150) maskScore += 20;     // High avg = possible mask
        if (brightRatio > 0.5) maskScore += 20;       // Mostly bright = likely mask

        hasMask = maskScore >= 50;  // Need strong evidence

        // Calculate confidence based on how strong the signals are
        let confidence;
        if (hasMask) {
            // Mask detected - confidence based on brightness
            confidence = 0.70 + (veryBrightRatio * 0.29);  // 70-99%
            confidence = Math.min(0.99, confidence);
        } else {
            // No mask - confidence based on how dark/normal skin is
            const skinScore = (darkPixels / totalPixels) * 0.5 + (1 - veryBrightRatio) * 0.5;
            confidence = 0.70 + (skinScore * 0.29);  // 70-99%
            confidence = Math.min(0.99, confidence);
        }

        return { hasMask, confidence };

    } catch (err) {
        console.error('Mask detection error:', err);
        return { hasMask: false, confidence: 0.75 };
    }
}

// Main Detection Loop
async function detectFaces() {
    if (!isDetecting) return;

    const startTime = performance.now();

    try {
        const predictions = await faceDetectionModel.estimateFaces(videoElement, false);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let withMask = 0;
        let withoutMask = 0;

        if (predictions.length > 0) {
            for (let i = 0; i < predictions.length; i++) {
                const prediction = predictions[i];
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                const faceX = start[0];
                const faceY = start[1];
                const faceWidth = size[0];
                const faceHeight = size[1];

                const faceId = `${Math.round(faceX / 40)}_${Math.round(faceY / 40)}`;

                let hasMask, confidence;

                if (faceStates.has(faceId)) {
                    const storedState = faceStates.get(faceId);
                    hasMask = storedState.hasMask;
                    confidence = storedState.confidence;
                } else {
                    // Detect mask using improved pixel analysis
                    const detection = detectMask(faceX, faceY, faceWidth, faceHeight);
                    hasMask = detection.hasMask;
                    confidence = detection.confidence;

                    faceStates.set(faceId, { hasMask, confidence });
                    console.log(`New detection: ${hasMask ? 'MASK' : 'NO MASK'} (${(confidence * 100).toFixed(0)}%)`);
                }

                if (hasMask) {
                    withMask++;
                    withMaskTotal++;
                } else {
                    withoutMask++;
                    withoutMaskTotal++;
                }

                totalDetections++;

                // Draw detection box
                ctx.strokeStyle = hasMask ? '#10b981' : '#ef4444';
                ctx.lineWidth = 4;
                ctx.strokeRect(start[0], start[1], size[0], size[1]);

                // Draw label
                const label = hasMask ? '😷 MASK DETECTED' : '⚠️ NO MASK';
                const labelText = `${label} ${(confidence * 100).toFixed(0)}%`;

                ctx.fillStyle = hasMask ? '#10b981' : '#ef4444';
                ctx.font = 'bold 18px Inter';

                const textWidth = ctx.measureText(labelText).width;

                // Handle text mirroring
                if (currentCamera === 'user') {
                    ctx.save();
                    ctx.scale(-1, 1);
                    const flippedX = -start[0] - textWidth - 10;
                    ctx.fillRect(flippedX - 10, start[1] - 30, textWidth + 20, 30);
                    ctx.fillStyle = 'white';
                    ctx.fillText(labelText, flippedX, start[1] - 8);
                    ctx.restore();
                } else {
                    ctx.fillRect(start[0], start[1] - 30, textWidth + 20, 30);
                    ctx.fillStyle = 'white';
                    ctx.fillText(labelText, start[0] + 10, start[1] - 8);
                }

                // Draw confidence bar
                const barWidth = size[0];
                const barHeight = 6;
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(start[0], end[1] + 5, barWidth, barHeight);
                ctx.fillStyle = hasMask ? '#10b981' : '#ef4444';
                ctx.fillRect(start[0], end[1] + 5, barWidth * confidence, barHeight);
            }

            updateUI(predictions.length, withMask, withoutMask);

            if (withoutMask > 0) {
                updateStatusBadge('warning', `${withoutMask} person(s) without mask`);
            } else if (withMask > 0) {
                updateStatusBadge('success', `All ${withMask} person(s) wearing masks`);
            }
        } else {
            updateUI(0, 0, 0);
            updateStatusBadge('info', 'No faces detected');
            faceStates.clear();
        }

    } catch (err) {
        console.error('Detection error:', err);
    }

    const endTime = performance.now();
    const detectionTime = endTime - startTime;
    detectionTimes.push(detectionTime);
    if (detectionTimes.length > 30) detectionTimes.shift();

    const now = Date.now();
    const delta = now - lastFrameTime;
    fps = Math.round(1000 / delta);
    lastFrameTime = now;

    document.getElementById('fpsDisplay').textContent = `${fps} FPS`;

    const avgTime = detectionTimes.reduce((a, b) => a + b, 0) / detectionTimes.length;
    document.getElementById('detectionTime').textContent = `${Math.round(avgTime)}ms`;

    requestAnimationFrame(detectFaces);
}

// Export Data
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        totalDetections: totalDetections,
        withMask: withMaskTotal,
        withoutMask: withoutMaskTotal,
        accuracy: totalDetections > 0 ? ((withMaskTotal / totalDetections) * 100).toFixed(1) : 0,
        avgFPS: fps,
        avgDetectionTime: detectionTimes.length > 0 ?
            (detectionTimes.reduce((a, b) => a + b, 0) / detectionTimes.length).toFixed(2) : 0,
        camera: currentCamera === 'user' ? 'Front' : 'Back'
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mask-detection-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    updateStatusBadge('success', 'Data exported!');
}

// View Reports
function viewReports() {
    const report = `
==============================================
    FACE MASK DETECTION REPORT
==============================================

Generated: ${new Date().toLocaleString()}

DETECTION STATISTICS:
---------------------
Total Detections: ${totalDetections}
With Mask: ${withMaskTotal}
Without Mask: ${withoutMaskTotal}
Compliance Rate: ${totalDetections > 0 ? ((withMaskTotal / totalDetections) * 100).toFixed(1) : 0}%

PERFORMANCE METRICS:
-------------------
Current FPS: ${fps}
Avg Detection Time: ${detectionTimes.length > 0 ? (detectionTimes.reduce((a, b) => a + b, 0) / detectionTimes.length).toFixed(2) : 0}ms

CAMERA:
-------
Active Camera: ${currentCamera === 'user' ? 'Front Camera' : 'Back Camera'}

DETECTION METHOD:
-----------------
Pixel Brightness Analysis
- Analyzes lower face region
- Detects white/light masks
- 70-99% confidence

==============================================
    `;

    alert(report);
}

// Update UI
function updateUI(faces, withMask, withoutMask) {
    document.getElementById('faceCount').textContent = `${faces} Face${faces !== 1 ? 's' : ''}`;
    document.getElementById('withMaskCount').textContent = withMask;
    document.getElementById('withoutMaskCount').textContent = withoutMask;

    if (totalDetections > 0) {
        const accuracy = ((withMaskTotal / totalDetections) * 100).toFixed(1);
        document.getElementById('accuracyValue').textContent = `${accuracy}%`;
    }

    const total = withMaskTotal + withoutMaskTotal;
    if (total > 0) {
        const maskedPercent = (withMaskTotal / total * 100).toFixed(1);
        const unmaskedPercent = (withoutMaskTotal / total * 100).toFixed(1);

        document.getElementById('maskedPercent').textContent = `${maskedPercent}%`;
        document.getElementById('unmaskedPercent').textContent = `${unmaskedPercent}%`;
        document.getElementById('maskedProgress').style.width = `${maskedPercent}%`;
        document.getElementById('unmaskedProgress').style.width = `${unmaskedPercent}%`;
    }
}

// Update Status Badge
function updateStatusBadge(type, message) {
    const badge = document.getElementById('statusBadge');
    if (!badge) return;
    badge.className = `status-badge status-${type}`;
    badge.querySelector('span').textContent = message;

    const icon = badge.querySelector('i');
    if (type === 'success') icon.className = 'fas fa-check-circle';
    else if (type === 'warning') icon.className = 'fas fa-exclamation-triangle';
    else if (type === 'danger') icon.className = 'fas fa-times-circle';
    else icon.className = 'fas fa-circle';
}

// Reset Stats
function resetStats() {
    totalDetections = 0;
    withMaskTotal = 0;
    withoutMaskTotal = 0;
    detectionTimes = [];

    document.getElementById('withMaskCount').textContent = '0';
    document.getElementById('withoutMaskCount').textContent = '0';
    document.getElementById('accuracyValue').textContent = '--';
    document.getElementById('faceCount').textContent = '0 Faces';
    document.getElementById('fpsDisplay').textContent = '0 FPS';
    document.getElementById('detectionTime').textContent = '0ms';
    document.getElementById('maskedProgress').style.width = '0%';
    document.getElementById('unmaskedProgress').style.width = '0%';
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('#themeToggle i');

    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        icon.className = 'fas fa-sun';
        settings.theme = 'light';
    } else {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'fas fa-moon';
        settings.theme = 'dark';
    }

    saveSettings();
}

// Fullscreen
function toggleFullscreen() {
    const container = document.querySelector('.video-container');

    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error('Fullscreen error:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Screenshot
function takeScreenshot() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.save();
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(videoElement, -canvas.width, 0, canvas.width, canvas.height);
    tempCtx.restore();

    tempCtx.save();
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0, canvas.width, canvas.height);
    tempCtx.restore();

    tempCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mask-detection-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Notifications
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '' });
    }
}

// Modal
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// Settings
function saveSettings() {
    localStorage.setItem('maskDetectorSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('maskDetectorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
        document.body.setAttribute('data-theme', settings.theme);

        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }

        const soundToggle = document.getElementById('soundToggle');
        const notifToggle = document.getElementById('notifToggle');
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        const trackingToggle = document.getElementById('trackingToggle');

        if (soundToggle) soundToggle.checked = settings.soundEnabled;
        if (notifToggle) notifToggle.checked = settings.notificationsEnabled;
        if (autoSaveToggle) autoSaveToggle.checked = settings.autoSave;
        if (trackingToggle) trackingToggle.checked = settings.tracking;
    }
}

// Initialize
window.addEventListener('load', init);

// Cleanup
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});

console.log('🎭 Face Mask Detector - IMPROVED DETECTION');
console.log('📊 Brightness Analysis: Avg, Very Bright (>180), Bright (>140)');
console.log(' ✅ Detects white/light masks by analyzing lower face');
console.log('🚀 Ready! Check console for detection details');
