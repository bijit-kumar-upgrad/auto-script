from fastapi import FastAPI, HTTPException, File, UploadFile
from io import BytesIO
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
from .services import get_ai_response
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://auto-script-q1v3.onrender.com"],  # Replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Temporary storage for uploaded file content
uploaded_file_content = None

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    global uploaded_file_content
    try:
        # Log the file name to confirm upload
        print(f"File uploaded: {file.filename}")

        # Check if the uploaded file is a .docx file
        if not file.filename.endswith(".docx"):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .docx file.")

        # Read the uploaded file content
        uploaded_file_content = await file.read()

        # Return success message
        return {"message": "File uploaded successfully", "filename": file.filename}

    except Exception as e:
        print(f"Error processing file: {str(e)}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/process-transcript")
async def process_transcript():
    global uploaded_file_content
    try:
        # Ensure a file has been uploaded
        if not uploaded_file_content:
            raise HTTPException(status_code=400, detail="No file uploaded. Please upload a file first.")

        # Convert bytes to a file-like object
        docx_file = BytesIO(uploaded_file_content)

        # Use python-docx to open and read the document
        document = Document(docx_file)
        text = []
        for para in document.paragraphs:
            text.append(para.text)

        # Join paragraphs and extract text
        input_doc = "\n".join(text)

        # Send the extracted text to the AI model and get the response
        ai_response = get_ai_response(input_doc)

        print("AI response generated successfully.")

        # Try to parse the response as JSON
        try:
            response_data = json.loads(ai_response)
        except Exception as e:
            print("AI response is not valid JSON array, returning as-is.")
            response_data = ai_response  # fallback

        '''
        # Save the AI response to a text file in JSON format
        with open("ai_response.txt", "w", encoding="utf-8") as f:
            f.write(str(response_data))
        '''
        
        # Return the AI-generated file to the frontend
        return {"content": response_data}

    except Exception as e:
        print(f"Error processing transcript: {str(e)}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=str(e))

# To run the server locally, use the following command:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000