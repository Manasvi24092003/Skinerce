document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const webcamForm = document.getElementById('webcam-form');
    const webcamImage = document.getElementById('webcam-image');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const enableCameraBtn = document.getElementById('enable-camera');
    
    let stream = null;
    canvas.width = 150;
    canvas.height = 150;

    // 1. Enable Camera Button
    enableCameraBtn.addEventListener('click', async function() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            video.srcObject = stream;
            video.style.display = 'block';
            enableCameraBtn.style.display = 'none';
            captureBtn.style.display = 'block';
            
        } catch (err) {
            console.error("Camera error:", err);
            alert("Could not access camera. Please check permissions.");
        }
    });

    // 2. Capture Button
    captureBtn.addEventListener('click', function() {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        previewImage.src = canvas.toDataURL('image/jpeg');
        previewContainer.style.display = 'block';
        captureBtn.style.display = 'none';
        
        // Stop camera stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });

    // 3. Retake Button
    retakeBtn.addEventListener('click', function() {
        previewContainer.style.display = 'none';
        initCamera();
    });

    // 4. Analyze Button
    analyzeBtn.addEventListener('click', function() {
        // Get full quality image from video
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = video.videoWidth;
        fullCanvas.height = video.videoHeight;
        const fullCtx = fullCanvas.getContext('2d');
        fullCtx.drawImage(video, 0, 0);
        
        // Set loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        analyzeBtn.disabled = true;
        
        // Convert to base64 and submit
        webcamImage.value = fullCanvas.toDataURL('image/jpeg', 0.9);
        webcamForm.submit();
    });

    // Initialize camera
    function initCamera() {
        enableCameraBtn.style.display = 'block';
        video.style.display = 'none';
        captureBtn.style.display = 'none';
    }
});