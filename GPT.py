import google.generativeai as genai
import base64
import pyttsx3

API = base64.b64decode('QUl6YVN5REptdjFIaTJ1bmsyRHJ1dUhUYzNaOXluTFA2aFk3QkxR').decode()
genai.configure(api_key=API)
model = genai.GenerativeModel('gemini-1.5-flash')

def speak(prompt:str):
    engine = pyttsx3.init()
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)
    engine.setProperty('rate', 150)
    engine.say(prompt)        
    engine.runAndWait()

def purify(text:str):
    black = '*^'
    for b in black:
        return text.replace(b,'')

def run(prompt:str):
    pre_prompt = 'keep the response precise and limited to 3-4 lines'
    response = model.generate_content(pre_prompt+'\n'+prompt)
    return purify(response.text)