document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.question-card');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressFill = document.getElementById('question-progress');
    const form = document.getElementById('skin-questionnaire');
    let currentQuestion = 0;

    // Initialize first question
    questions[currentQuestion].classList.add('active');
    updateProgress();
    updateButtons();

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        if (validateQuestion(currentQuestion)) {
            goToQuestion(currentQuestion + 1);
        } else {
            showAlert('Please select an option to continue');
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', function() {
        goToQuestion(currentQuestion - 1);
    });

    // Form submission handler
    form.addEventListener('submit', function(e) {
        if (!validateAllQuestions()) {
            e.preventDefault();
            showAlert('Please answer all questions before submitting');
            return;
        }

        showLoadingState(true);
    });

    function goToQuestion(index) {
        // Animation: Fade out current question
        questions[currentQuestion].style.opacity = '0';
        
        setTimeout(() => {
            questions[currentQuestion].classList.remove('active');
            currentQuestion = index;
            questions[currentQuestion].classList.add('active');
            
            // Animation: Fade in new question
            questions[currentQuestion].style.opacity = '1';
            
            updateButtons();
            updateProgress();
            
            // Smooth scroll to question
            questions[currentQuestion].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }

    function validateQuestion(index) {
        const inputs = questions[index].querySelectorAll('input[type="radio"]');
        return Array.from(inputs).some(input => input.checked);
    }

    function validateAllQuestions() {
        return Array.from(questions).every((_, index) => validateQuestion(index));
    }

    function updateButtons() {
        prevBtn.disabled = currentQuestion === 0;
        
        if (currentQuestion === questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function showLoadingState(show) {
        const submitText = document.getElementById('submit-text');
        const spinner = document.getElementById('submit-spinner');
        
        if (show) {
            submitText.textContent = "Analyzing your answers...";
            spinner.style.display = 'inline-block';
            nextBtn.disabled = true;
            prevBtn.disabled = true;
            submitBtn.disabled = true;
        } else {
            submitText.textContent = "Get Recommendations";
            spinner.style.display = 'none';
        }
    }

    function showAlert(message) {
        // Create or use existing alert element
        let alertBox = document.getElementById('form-alert');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'form-alert';
            alertBox.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #ff4444;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            `;
            document.body.appendChild(alertBox);
        }
        
        alertBox.textContent = message;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            alertBox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => alertBox.remove(), 300);
        }, 3000);
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        .question-card {
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});