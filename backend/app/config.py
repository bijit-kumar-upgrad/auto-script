from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configuration for the FastAPI application
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
BASE_URL = "https://models.github.ai/inference"
MODEL = "openai/gpt-4.1"

# Ensure that the GITHUB_TOKEN is set
if GITHUB_TOKEN is None:
    raise ValueError("GITHUB_TOKEN environment variable not set.")