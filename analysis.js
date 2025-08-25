document.addEventListener('DOMContentLoaded', function() {
    // =====================
    // FILE UPLOAD PREVIEW WITH FILENAME
    // =====================
    const fileUpload = document.getElementById('file-upload');
    const uploadedPreview = document.getElementById('uploaded-preview');
    const uploadPreviewContainer = document.getElementById('upload-preview');
    const fileNameDisplay = document.createElement('div'); // Create filename display element
    
    // Style the filename display
    fileNameDisplay.style.marginTop = '10px';
    fileNameDisplay.style.fontSize = '0.9rem';
    fileNameDisplay.style.color = '#666';
    
    // Add filename display below the preview container
    if (uploadPreviewContainer) {
        uploadPreviewContainer.appendChild(fileNameDisplay);
    }

    fileUpload.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            // Display file name
            fileNameDisplay.textContent = `File: ${file.name}`;
            fileNameDisplay.style.display = 'block';
            
            reader.onload = function(e) {
                uploadedPreview.src = e.target.result;
                uploadPreviewContainer.style.display = 'block';
                
                // Auto-resize large images
                uploadedPreview.onload = function() {
                    const MAX_WIDTH = 500;
                    if (this.width > MAX_WIDTH) {
                        this.width = MAX_WIDTH;
                        this.style.height = 'auto';
                    }
                };
            }
            
            reader.readAsDataURL(file);
        } else {
            uploadPreviewContainer.style.display = 'none';
            fileNameDisplay.style.display = 'none';
        }
    });

    // =====================
    // WEBCAM CAPTURE
    // =====================
    const enableCameraBtn = document.getElementById('enable-camera');
    const video = document.getElementById('webcam');
    const captureBtn = document.getElementById('capture-btn');
    const canvas = document.getElementById('canvas');
    const previewImage = document.getElementById('preview-image');
    const previewContainer = document.getElementById('preview-container');
    const retakeBtn = document.getElementById('retake-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const webcamForm = document.getElementById('webcam-form');
    
    let mediaStream = null;

    // Enable Camera Button
    if (enableCameraBtn) {
        enableCameraBtn.addEventListener('click', async function() {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    },
                    audio: false
                });
                
                video.srcObject = mediaStream;
                video.style.display = 'block';
                enableCameraBtn.style.display = 'none';
                captureBtn.style.display = 'block';
                
                mediaStream.getVideoTracks()[0].onended = () => {
                    resetWebcam();
                };
                
            } catch (err) {
                console.error("Camera Error:", err);
                alert("Could not access camera. Please check permissions.");
                resetWebcam();
            }
        });
    }

    // Capture Button
    if (captureBtn) {
        captureBtn.addEventListener('click', function() {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            previewImage.src = canvas.toDataURL('image/jpeg', 0.9);
            previewContainer.style.display = 'block';
            captureBtn.style.display = 'none';
            
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        });
    }

    // Retake Button
    if (retakeBtn) {
        retakeBtn.addEventListener('click', function() {
            previewContainer.style.display = 'none';
            initCamera();
        });
    }

    // Analyze Button
    if (analyzeBtn && webcamForm) {
        analyzeBtn.addEventListener('click', function() {
            const originalText = analyzeBtn.innerHTML;
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
            analyzeBtn.disabled = true;
            
            const imageData = canvas.toDataURL('image/jpeg', 0.85);
            document.getElementById('webcam-image').value = imageData;
            
            setTimeout(() => {
                webcamForm.submit();
            }, 300);
        });
    }

    // =====================
    // HELPER FUNCTIONS
    // =====================
    function initCamera() {
        navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        }).then(stream => {
            mediaStream = stream;
            video.srcObject = stream;
            video.style.display = 'block';
            captureBtn.style.display = 'block';
        }).catch(err => {
            console.error("Camera Re-init Error:", err);
            resetWebcam();
        });
    }

    function resetWebcam() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        video.style.display = 'none';
        previewContainer.style.display = 'none';
        captureBtn.style.display = 'none';
        enableCameraBtn.style.display = 'block';
    }

    window.addEventListener('beforeunload', function() {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
    });
});