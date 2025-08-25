# Skinerce - AI-Powered Skin Analysis App

![Skinerce](https://img.shields.io/badge/Flask-2.3.3-green) ![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13.0-orange) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-blue)

Skinerce is an intelligent web application that combines computer vision and AI to analyze skin conditions, provide personalized skincare recommendations, and offer dermatological advice through an interactive assistant.

## 🌟 Features

### 🔍 Skin Condition Analysis
- **Image Analysis**: Upload images or use webcam capture for instant skin analysis
- **Multi-Condition Detection**: Identifies acne, blackheads, dark spots, and wrinkles
- **Confidence Scoring**: Provides accuracy percentages for each detection
- **Analysis History**: Tracks all your previous skin analyses

### 💡 Personalized Recommendations
- **Interactive Questionnaire**: Comprehensive skin assessment survey
- **AI-Powered Suggestions**: Tailored skincare routines based on your specific concerns
- **Ingredient Recommendations**: Suggests effective ingredients for your skin type

### 🤖 AI Dermatology Assistant
- **GPT-3.5 Powered**: Intelligent conversations about skin health
- **Instant Advice**: Get professional skincare recommendations
- **24/7 Availability**: Always available to answer your questions

### 👤 User Management
- **Secure Authentication**: User registration and login system
- **Personal Profiles**: Save your skin analysis history and preferences
- **Session Management**: Secure user sessions and data storage

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **Machine Learning**: TensorFlow/Keras
- **AI Chat**: OpenAI GPT-3.5 Turbo
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Werkzeug security
- **Image Processing**: OpenCV (through TensorFlow)

## 📦 Installation

### Prerequisites
- Python 3.8+
- pip package manager
- OpenAI API key

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/skinerce.git
   cd skinerce
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   export SECRET_KEY='your-secret-key-here'
   export OPENAI_API_KEY='your-openai-api-key-here'
   ```

5. **Download the pre-trained model**
   - Place `skinmate_model1.h5` in the root directory
   - Ensure it's trained to detect: ['acne', 'blackheads', 'darkspots', 'wrinkles']

6. **Run the application**
   ```bash
   python app.py
   ```

7. **Access the app**
   Open your browser and go to `http://localhost:5000`

## 📁 Project Structure

```
skinerce/
├── app.py                 # Main Flask application
├── skinmate_model1.h5    # Pre-trained ML model
├── core/
│   └── GPT.py           # OpenAI integration module
├── static/
│   ├── uploads/         # User-uploaded images
│   └── css/             # Stylesheets
├── templates/           # HTML templates
│   ├── home.html
│   ├── analysis.html
│   ├── results.html
│   ├── questionnaire.html
│   ├── results2.html
│   ├── assistant.html
│   ├── dashboard.html
│   ├── tips.html
│   ├── profile.html
│   ├── login.html
│   └── signup.html
└── requirements.txt     # Python dependencies
```

## 🎯 Usage

### 1. **Registration & Login**
- Create an account or login to access all features
- Your data is securely stored in session

### 2. **Skin Analysis**
- **Upload Image**: Select a skin image from your device
- **Webcam Capture**: Use your camera for instant analysis
- **View Results**: Get condition detection with confidence scores

### 3. **Questionnaire**
- Complete the skin assessment survey
- Receive personalized ingredient recommendations
- Get tailored skincare routine suggestions

### 4. **AI Assistant**
- Ask any skin-related questions
- Get instant professional advice
- Continuous conversation support

### 5. **Dashboard & History**
- Track your analysis history
- Monitor skin condition trends
- Access previous recommendations

## 🔧 API Endpoints

- `POST /analysis` - Process skin image analysis
- `POST /webcam_capture` - Handle webcam image analysis
- `POST /api/assist` - AI assistant chat endpoint
- `POST /questionnaire` - Process skin assessment
- `GET /results` - Display analysis results
- `GET /dashboard` - User analysis history

## 🚀 Deployment

### Local Deployment
```bash
python app.py
```

### Production Deployment
1. Set `debug=False` in `app.run()`
2. Use production WSGI server (Gunicorn)
3. Configure reverse proxy (Nginx)
4. Set proper environment variables
5. Enable HTTPS

## 📊 Machine Learning Model

- **Framework**: TensorFlow/Keras
- **Input Size**: 150x150 pixels
- **Classes**: acne, blackheads, darkspots, wrinkles
- **Output**: Classification with confidence scores

## 🔒 Security Features

- Password hashing with Werkzeug
- Session management
- File upload validation
- Secure API key handling

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- TensorFlow team for ML framework
- OpenAI for GPT integration
- Flask community for web framework
- All contributors and testers

---

**Note**: This application is for educational and informational purposes only. It is not a substitute for professional medical advice. Always consult a dermatologist for serious skin concerns.

**Build with ❤️ for better skin health**
