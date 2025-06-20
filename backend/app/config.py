from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configuration for the FastAPI application
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
BASE_URL = "https://models.github.ai/inference"
MODEL = "openai/gpt-4.1"
API_ENDPOINT = os.getenv("API_ENDPOINT")

# Ensure that the GITHUB_TOKEN is set
if GITHUB_TOKEN is None:
    raise ValueError("GITHUB_TOKEN environment variable not set.")

# Ensure that the API_ENDPOINT is set
if API_ENDPOINT is None:
    raise ValueError("API_ENDPOINT environment variable not set.")