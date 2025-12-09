// Premium Face Mask Detector - Enhanced Features
// TensorFlow.js & BlazeFace Integration

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

    // Feature toggles
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
}

// Start Detection
async function startDetection() {
    try {
        updateStatusBadge('info', 'Requesting camera...');
        document.getElementById('startBtn').disabled = true;

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
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
            console.log('✓ BlazeFace model loaded');
        }

        updateStatusBadge('success', 'Detection active');
        document.getElementById('stopBtn').disabled = false;

        isDetecting = true;
        detectFaces();

        if (settings.notificationsEnabled) {
            showNotification('Detection Started', 'Face mask detection is now active');
        }

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
    resetStats();
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
            for (const prediction of predictions) {
                const start = prediction.topLeft;
                const end = prediction.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];

                // Simulated mask detection (replace with actual model)
                const hasMask = Math.random() > 0.4;
                const confidence = Math.random() * 0.3 + 0.7;

                if (hasMask) {
                    withMask++;
                    withMaskTotal++;
                } else {
                    withoutMask++;
                    withoutMaskTotal++;

                    if (settings.soundEnabled) {
                        playAlert();
                    }
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
                ctx.fillRect(start[0], start[1] - 30, textWidth + 20, 30);

                ctx.fillStyle = 'white';
                ctx.fillText(labelText, start[0] + 10, start[1] - 8);

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
        }

    } catch (err) {
        console.error('Detection error:', err);
    }

    // Calculate FPS and detection time
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

// Update UI
function updateUI(faces, withMask, withoutMask) {
    document.getElementById('faceCount').textContent = `${faces} Face${faces !== 1 ? 's' : ''}`;
    document.getElementById('withMaskCount').textContent = withMask;
    document.getElementById('withoutMaskCount').textContent = withoutMask;

    // Update accuracy
    if (totalDetections > 0) {
        const accuracy = ((withMaskTotal / totalDetections) * 100).toFixed(1);
        document.getElementById('accuracyValue').textContent = `${accuracy}%`;
    }

    // Update progress bars
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

    // Draw video frame
    tempCtx.save();
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(videoElement, -canvas.width, 0, canvas.width, canvas.height);
    tempCtx.restore();

    // Draw detection overlay  
    tempCtx.save();
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(canvas, -canvas.width, 0, canvas.width, canvas.height);
    tempCtx.restore();

    // Download
    tempCanvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mask-detection-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);

        if (settings.notificationsEnabled) {
            showNotification('Screenshot Saved', 'Detection screenshot downloaded');
        }
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

// Sound Alert
function playAlert() {
    // Simple beep using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Modal
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Settings
function saveSettings() {
    localStorage.setItem('maskDetectorSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('maskDetectorSettings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };

        // Apply theme
        document.body.setAttribute('data-theme', settings.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

        // Apply toggle states
        document.getElementById('soundToggle').checked = settings.soundEnabled;
        document.getElementById('notifToggle').checked = settings.notificationsEnabled;
        document.getElementById('autoSaveToggle').checked = settings.autoSave;
        document.getElementById('trackingToggle').checked = settings.tracking;
    }
}

// Initialize on load
window.addEventListener('load', init);

// Cleanup
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});

console.log('🎭 Face Mask Detector - Premium Edition');
console.log('✨ Enhanced UI with Advanced Features');
console.log('🚀 Ready to detect!');
