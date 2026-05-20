import os
import google.generativeai as genai
from dotenv import load_dotenv
import asyncio

# Load variables from .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using the fast flash model for instant hackathon responses!
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

async def ask_gemini(prompt: str, fallback_response: str) -> str:
    """
    Calls the Gemini API if configured. If it fails or is missing, returns the fallback.
    """
    if not model:
        print("[Gemini Agent] Missing API Key. Using fallback response.")
        return fallback_response
    
    try:
        # Run synchronous generate_content in a thread to avoid blocking FastAPI
        print("\n" + "="*50)
        print("[AI AGENT] 🧠 Brain is thinking about the following prompt:")
        print(prompt.strip())
        print("="*50)

        response = await asyncio.to_thread(model.generate_content, prompt)
        text_response = response.text.strip().replace('**', '')
        
        print("\n[AI AGENT] ✨ Generated Output:")
        print(text_response)
        print("="*50 + "\n")
        
        return text_response
    except Exception as e:
        print("\n[AI AGENT ERROR] ⚠️ Gemini failed. Firing Resilient Fallback mechanism.")
        print(f"Error Details: {e}\n")
        return fallback_response
