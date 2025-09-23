from fastapi import FastAPI, HTTPException, File, UploadFile, Request
from io import BytesIO
from docx import Document
from fastapi.middleware.cors import CORSMiddleware
from .services import get_ai_response, regenerate_response_for_list
import json
from .config import API_ENDPOINT
from .get_video_transcript import get_video_transcript
from pydantic import BaseModel
import os
import traceback
from .vectorstore_manager import init_vectorstore

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    # Initialise vectorstore once when the app starts
    init_vectorstore()
    print("Vectorstore initialized and ready to use.")

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

@app.post("/api/process-transcript")
async def process_transcript(request: Request, file: UploadFile = File(...)):
    try:
        # Ensure a file has been uploaded
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded. Please upload a file first.")
        
        # Log the file name to confirm upload
        print(f"File uploaded: {file.filename}")

        # Check if the uploaded file is a .docx, or .txt file
        allowed_extensions = [".docx", ".txt"]
        if not any(file.filename.lower().endswith(ext) for ext in allowed_extensions):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .docx, .doc, or .txt file.")

        # Read the uploaded file content
        uploaded_file_content = await file.read()
    except:
        print(f"Error processing file: {str(e)}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=str(e))

    # Extract the processing options data from the request
    try:
        # Extract the processing options data from the request
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
        file_extension = os.path.splitext(file.filename)[1].lower()
        input_doc = ""

        if file_extension == ".docx":
            # Convert bytes to a file-like object
            docx_file = BytesIO(uploaded_file_content)

            # Use python-docx to open and read the document
            document = Document(docx_file)
            text = []
            for para in document.paragraphs:
                text.append(para.text)

            # Join paragraphs and extract text
            input_doc = "\n".join(text)

        elif file_extension == ".txt":
            input_doc = uploaded_file_content.decode('utf-8', errors='ignore')
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")

        # Send the extracted text to the AI model and get the response
        ai_response = await get_ai_response(input_doc, processing_options_data)

        #print(f"AI Response: {ai_response}")
        # with open("ai_response.txt", "w", encoding="utf-8") as f:
        #     f.write(ai_response)
        
        '''
        #Dummy file for testing
        # Get the current directory of this script
        current_dir = os.path.dirname(__file__)

        # Load dummy response from a .txt file in the same directory
        dummy_file_path = os.path.join(current_dir, "new_response.txt")
        with open(dummy_file_path, "r", encoding="utf-8") as dummy_file:
            dummy_content = dummy_file.read()

        print("Dummy: ", dummy_content)
        ai_response = dummy_content
        
        #print("AI response generated successfully.")
        '''

        # Try to parse the response as JSON
        try:
            response_data = json.loads(ai_response)
        except Exception as e:
            #print("AI response is not valid JSON array, returning as-is.")
            response_data = ai_response  # fallback

        # Return the AI-generated file to the frontend
        return response_data

    except Exception as e:
        print("Full Error: ")
        traceback.print_exc()
        #print(f"Error processing transcript(b): {str(e)}")  # Log error for debugging
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/update-templates")
async def update_templates(request: Request):
    try:
        # Parse incoming data
        formData = await request.form()
        modified_rows_str = formData.get('modifiedRows')
        main_response_data_str = formData.get('mainResponseData')

        if not modified_rows_str:
            raise HTTPException(status_code=400, detail="No modified rows found")
        
        if not main_response_data_str:
            raise HTTPException(status_code=400, detail="No main response data found")
        
        modified_rows = json.loads(modified_rows_str)
        main_response_data = json.loads(main_response_data_str)

        #print("Received modified rows:", modified_rows)

        response = await regenerate_response_for_list(modified_rows, main_response_data)

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
        (transcript, audio_path, video_path) = get_video_transcript(video)

        print(f"Temp path: {audio_path} | {video_path}")

        os.remove(video_path)
        os.remove(audio_path)

        if transcript:
            return {"message": "Video uploaded and processed successfully", "transcript": transcript}
        else:
            return {"message": "Error processing video", "transcript": ""}
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        return {"message": "Error processing video", "transcript": ""}

# To run the server locally, use the following command:
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000