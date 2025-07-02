from fastapi import FastAPI, HTTPException, File, UploadFile, Request
from io import BytesIO
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
from .services import get_ai_response, regenerate_response, regenerate_response_for_list
import json
from .config import API_ENDPOINT
from .get_video_transcript import get_video_transcript
from pydantic import BaseModel
import os

app = FastAPI()

class ResponseMessage(BaseModel):
    message: str
    transcript: str

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[API_ENDPOINT, "*"],  # Replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Temporary storage for uploaded file content
uploaded_file_content = None
first_response_data = None

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
async def process_transcript(request: Request):
    global uploaded_file_content, first_response_data

    # Ensure a file has been uploaded
    if not uploaded_file_content:
        raise HTTPException(status_code=400, detail="No file uploaded. Please upload a file first.")

    # Extract the processing options data from the request
    try:
        body = await request.form()
        processing_options_data = body.get('processingOptionsData')

        if not processing_options_data:
            raise HTTPException(status_code=400, detail="Processing options data is missing.")
        
        # Parse the processing options data
        processing_options_data = json.loads(processing_options_data)
        #print("Data: ", processing_options_data)

        # Ensure the values add up to 100
        if sum(processing_options_data) != 100:
            raise HTTPException(status_code=400, detail="The sum of Faceshots, Templates, and Graphics must add up to 100.")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing processing options: {str(e)}")
    
    try:
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
        ai_response = get_ai_response(input_doc, processing_options_data)

        '''
        # Get the current directory of this script
        current_dir = os.path.dirname(__file__)

        # Load dummy response from a .txt file in the same directory
        dummy_file_path = os.path.join(current_dir, "new_response.txt")
        with open(dummy_file_path, "r") as dummy_file:
            dummy_content = dummy_file.read()

        ai_response = dummy_content
        '''
        #print("AI response generated successfully.")

        # Try to parse the response as JSON
        try:
            response_data = json.loads(ai_response)
        except Exception as e:
            #print("AI response is not valid JSON array, returning as-is.")
            response_data = ai_response  # fallback

        first_response_data = response_data

        # Return the AI-generated file to the frontend
        return response_data

    except Exception as e:
        print(f"Error processing transcript(b): {str(e)}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/update-templates")
async def update_templates(request: Request):
    global first_response_data
    try:
        # Parse incoming data
        formData = await request.form()
        modified_rows = formData.get('modifiedRows')

        if not modified_rows:
            raise HTTPException(status_code=400, detail="No modified rows found")

        #print("Received modified rows:", modified_rows)

        response = regenerate_response_for_list(modified_rows, first_response_data)

        return response
    except Exception as e:
        print(f"Error updating templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-video", response_model=ResponseMessage)
async def upload_video(video: UploadFile = File(...)):
    try:
        # Log the file name to confirm upload
        print(f"Video uploaded: {video.filename}")
        
        # Send the video for processing
        transcript = get_video_transcript(video)

        if transcript:
            return {"message": "Video uploaded and processed successfully", "transcript": transcript}
        else:
            return {"message": "Error processing video", "transcript": ""}
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        return {"message": "Error processing video", "transcript": ""}

# To run the server locally, use the following command:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000