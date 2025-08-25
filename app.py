from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from datetime import datetime
import core.GPT as GPT
import numpy as np
import os, base64, openai

app = Flask(__name__)


from flask import Flask, render_template, request, redirect, session
from werkzeug.security import generate_password_hash, check_password_hash

# Mock database (replace with SQLite/PostgreSQL later)
users_db = {}

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users_db.get(email)
        if user and check_password_hash(user['password'], password):
            session['user'] = email
            return redirect('/profile')
        return "Invalid credentials!"
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        users_db[email] = {'name': name, 'password': password}
        return redirect('/login')
    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

# Configure OpenAI
openai.api_key = os.environ.get('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')

@app.route('/assistant')
def assistant():
    question = request.args.get('q', '')
    return render_template('assistant.html', initial_question=question)

@app.route('/api/assist', methods=['POST'])
def assist():
    try:
        # Get the message from the request
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Invalid request format'}), 400
            
        user_message = data['message']
        print(f"Received question: {user_message}")  # Debug logging

        # Create the conversation with OpenAI
        # response = openai.ChatCompletion.create(
        #     model="gpt-3.5-turbo",
        #     messages=[
        #         {
        #             "role": "system", 
        #             "content": """You are Skinerce, a dermatology AI assistant. Provide:
        #             - Concise skin advice (2-3 sentences max)
        #             - Professional but friendly tone
        #             - Focus on skincare solutions"""
        #         },
        #         {
        #             "role": "user",
        #             "content": user_message
        #         }
        #     ],
        #     temperature=0.7,
        #     max_tokens=150
        # )

        response = GPT.run(user_message)

        # Extract and return the response
        # ai_response = response.choices[0].message['content']
        # print(f"AI Response: {ai_response}")  # Debug logging
        # return jsonify({'response': ai_response})

        return jsonify({'response': response})

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug logging
        return jsonify({'error': str(e)}), 500

    
# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the pre-trained model
model = load_model('skinmate_model1.h5')
class_names = ['acne', 'blackheads', 'darkspots', 'wrinkles']

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img_path, target_size=(150, 150)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

def predict_skin_condition(img_array):
    predictions = model.predict(img_array)
    predicted_class = int(np.argmax(predictions[0]))
    confidence = float(np.max(predictions[0]) * 100)
    return class_names[predicted_class], round(confidence, 2)

def save_to_history(condition, confidence, image_path, filename):
    if 'analysis_history' not in session:
        session['analysis_history'] = []
    
    session['analysis_history'].append({
        'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
        'condition': condition,
        'confidence': float(confidence),
        'image_path': image_path.replace('static/', ''),
        'filename': filename
    })
    session.modified = True

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/analysis', methods=['GET', 'POST'])
def analysis():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file selected')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            img_array = preprocess_image(filepath)
            condition, confidence = predict_skin_condition(img_array)
            
            session['result'] = {
                'condition': condition,
                'confidence': float(confidence),
                'image_path': filepath,
                'filename': filename,
                'source': 'upload'
            }
            
            save_to_history(condition, confidence, filepath, filename)
            return redirect(url_for('results'))
    
    return render_template('analysis.html')

@app.route('/webcam_capture', methods=['POST'])
def webcam_capture():
    if 'webcam_image' in request.form:
        try:
            # Get base64 image data
            img_data = request.form['webcam_image'].split(',')[1]
            img_bytes = base64.b64decode(img_data)
            
            # Save the image
            filename = f"webcam_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            with open(filepath, 'wb') as f:
                f.write(img_bytes)
            
            # Process and predict
            img_array = preprocess_image(filepath)
            condition, confidence = predict_skin_condition(img_array)
            
            # Store results
            session['result'] = {
                'condition': condition,
                'confidence': float(confidence),
                'image_path': filepath,
                'source': 'webcam'
            }
            
            return redirect(url_for('results'))
            
        except Exception as e:
            print(f"Webcam Error: {str(e)}")
            flash('Error processing webcam image')
    
    return redirect(url_for('analysis'))
    
@app.route('/results')
def results():
    result = session.get('result', None)
    if not result:
        return redirect(url_for('analysis'))
    
    result['confidence'] = float(result['confidence'])
    return render_template('results.html', result=result)

@app.route('/questionnaire', methods=['GET', 'POST'])
def questionnaire():
    if request.method == 'POST':
        # Process form data
        answers = {
            'breakouts': request.form.get('breakouts'),
            'oiliness': request.form.get('oiliness'),
            'sensitivity': request.form.get('sensitivity'),
            'aging': request.form.get('aging'),
            'pigmentation': request.form.get('pigmentation')
        }
        
        # Determine skin concerns
        concerns = []
        if answers['breakouts'] in ['often', 'very_often']:
            concerns.append('acne')
        if answers['oiliness'] in ['oily', 'very_oily']:
            concerns.append('blackheads')
        if answers['pigmentation'] in ['often', 'very_often']:
            concerns.append('darkspots')
        if answers['aging'] in ['concerned', 'very_concerned']:
            concerns.append('wrinkles')
        
        primary_concern = concerns[0] if concerns else 'general'
        
        # Generate recommendations
        recommendations = {
            'acne': [
                "Gentle non-comedogenic cleansers",
                "Salicylic acid (2%) products",
                "Benzoyl peroxide (2.5-5%) spot treatments"
            ],
            'blackheads': [
                "BHA exfoliants 2-3 times weekly",
                "Clay masks weekly",
                "Professional extractions if needed"
            ],
            'darkspots': [
                "Vitamin C serums (10-20%)",
                "Daily SPF 30+ sunscreen",
                "Niacinamide (5%) products"
            ],
            'wrinkles': [
                "Low-concentration retinol (0.25%)",
                "Hyaluronic acid serums",
                "Peptide moisturizers"
            ],
            'general': [
                "Balanced pH cleanser",
                "Daily broad-spectrum sunscreen",
                "Antioxidant serum"
            ]
        }
        
        # Store results in session
        session['questionnaire_results'] = {
            'primary_concern': primary_concern,
            'concerns': concerns,
            'recommendations': recommendations[primary_concern],
            'answers': answers,
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        
        # Debug print to verify data
        print("Stored in session:", session['questionnaire_results'])
        
        # Redirect to results2
        return redirect(url_for('results2'))
    
    return render_template('questionnaire.html')

@app.route('/results2')
def results2():
    if 'questionnaire_results' not in session:
        flash('Please complete the questionnaire first', 'error')
        return redirect(url_for('questionnaire'))
    
    # Debug print to verify data
    print("Accessing session data:", session['questionnaire_results'])
    
    return render_template('results2.html', 
                         questionnaire_results=session['questionnaire_results'])

# @app.route('/questionnaire', methods=['GET', 'POST'])
# def questionnaire():
#     if request.method == 'POST':
#         answers = {
#             'breakouts': request.form.get('breakouts'),
#             'oiliness': request.form.get('oiliness'),
#             'sensitivity': request.form.get('sensitivity'),
#             'aging': request.form.get('aging'),
#             'pigmentation': request.form.get('pigmentation')
#         }
        
#         concerns = []
#         if answers['breakouts'] in ['often', 'very_often']:
#             concerns.append('acne')
#         if answers['oiliness'] in ['often', 'very_often']:
#             concerns.append('blackheads')
#         if answers['pigmentation'] in ['often', 'very_often']:
#             concerns.append('darkspots')
#         if answers['aging'] in ['concerned', 'very_concerned']:
#             concerns.append('wrinkles')
        
#         primary_concern = concerns[0] if concerns else 'general'
        
#         ingredients = []
#         if 'acne' in concerns or 'blackheads' in concerns:
#             ingredients.append('salicylic acid')
#         if 'darkspots' in concerns:
#             ingredients.append('vitamin C')
#         if 'wrinkles' in concerns:
#             ingredients.append('retinol')
#         if not ingredients:
#             ingredients.append('hyaluronic acid')
        
#         session['questionnaire_results'] = {
#             'primary_concern': primary_concern,
#             'ingredients': ingredients,
#             'answers': answers
#         }
#         session.modified = True
        
#         return redirect(url_for('profile'))
    
#     return render_template('questionnaire.html')
# @app.route('/results2')
# def results2():
#     if 'questionnaire_results' not in session:
#         return redirect(url_for('questionnaire'))
#     return render_template('results2.html', 
#                          questionnaire_results=session['questionnaire_results'])

@app.route('/dashboard')
def dashboard():
    analysis_history = session.get('analysis_history', [])
    return render_template('dashboard.html', history=analysis_history)

@app.route('/tips')
def tips():
    return render_template('tips.html')

@app.route('/profile')
def profile():
    questionnaire_results = session.get('questionnaire_results', None)
    analysis_history = session.get('analysis_history', [])
    return render_template('profile.html', 
                        questionnaire=questionnaire_results,
                        history=analysis_history)

if __name__ == '__main__':

    app.run(debug=True)
