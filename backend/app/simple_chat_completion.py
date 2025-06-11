import os
from openai import OpenAI
from config import BASE_URL, MODEL, GITHUB_TOKEN
from docx import Document  # Import the library to handle .docx files

# Get the current directory of this script
current_dir = os.path.dirname(__file__)

# Construct the relative paths to the .md and .docx files
md_file_path = os.path.join(current_dir, "pps-master-prompt.md")
docx_file_path = os.path.join(current_dir, "script.docx")

# Read the .md file content
with open(md_file_path, "r") as file:
    markdown_content = file.read()

# Read the .docx file content
def read_docx(file_path):
    document = Document(file_path)
    content = []
    for paragraph in document.paragraphs:
        content.append(paragraph.text)
    return "\n".join(content)

docx_content = read_docx(docx_file_path)

client = OpenAI(base_url=BASE_URL, api_key=GITHUB_TOKEN)

print("Sending request to OpenAI API...")

response = client.chat.completions.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": markdown_content},
        {"role": "user",
         "content": "Create a pps based on the script provided here:" + docx_content + 
                    "Please provide the output in JSON format only. Do not include any introductory text, conclusion, or follow-up questions. Focus solely on the content, including any necessary headings, lists, and tables, without additional commentary or explanations. Use only normal UTF-8 characters — avoid using quotations, emojis, or any special characters."}
    ]
)

response_text = response.choices[0].message.content

print('Response:', response_text)

