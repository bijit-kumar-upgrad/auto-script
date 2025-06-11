import os
from azure.core.credentials import AzureKeyCredential
from azure.ai.inference import ChatCompletionsClient
from fastapi import HTTPException
from .config import BASE_URL, MODEL, GITHUB_TOKEN
from openai import OpenAI

# Function to get the AI response
def get_ai_response(input_script) -> str:
    try:
        # Initialize the Azure ChatCompletionsClient
        client = OpenAI(base_url=BASE_URL, api_key=GITHUB_TOKEN)

        # Get the current directory of this script
        current_dir = os.path.dirname(__file__)

        # Construct the relative paths to the .md and .docx files
        md_file_path = os.path.join(current_dir, "pps-master-prompt.md")

        # Read the .md file content
        with open(md_file_path, "r") as file:
            markdown_content = file.read()

        print("Sending request to OpenAI API...")

        # Prepare the request payload
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
            {"role": "system", "content": markdown_content},
            {"role": "user",
            "content": (
                "Create a pps based on the script provided here:" + input_script +
                "Please provide the output in JSON format only. Ensure that the output follows the provided guideline. Do not include any introductory text, conclusion, or follow-up questions."
                "Focus solely on the content, including any necessary headings, lists, and tables, without additional commentary or explanations. "
                "Use only normal UTF-8 characters — avoid using quotations, emojis, or any special characters. "
                "Ensure the JSON response matches the following structure:\n"
                "[\n"
                "  {\n"
                "    \"script_block\": \"string\",\n"
                "    \"pps\": {\n"
                "      \"plate_type\": \"string\",\n"
                "      \"description\": \"string or Array of objects with 'point' and 'subpoints' properties\"\n"
                "    }\n"
                "  }\n"
                "]"
            )}
            ]
        )

        # Extract and return the AI-generated response
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interacting with AI model: {str(e)}")
