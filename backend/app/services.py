from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing_extensions import List, TypedDict
from .LLM_1_Master import master_response,get_template_plates_summary, templateTypeEnum
from .LLM_2_ppt import query_with_pps_format
from .create_vector_store import create_vector_store
import json
import asyncio

# Function to get the AI response
async def get_ai_response(input_script, processing_options) -> str:
    vectorstore = create_vector_store()

    master_response_var = master_response(input_script, processing_options)
    template_plates = get_template_plates_summary(master_response_var)

    # Create async tasks
    tasks = [
        query_with_pps_format(vectorstore, plate['transcript'])
        for plate in template_plates
    ]

    # Run all async tasks concurrently while preserving order
    templates = await asyncio.gather(*tasks)

    '''
    templates = []
    for plate in template_plates:
        template = query_with_pps_format(vectorstore, plate['transcript'])
        templates.append(template)
    '''

    master_json= master_response_var.model_dump()
    master_json['plates'][0]

    return add_plate_details(master_json, templates)

def add_plate_details(master_json,templates):
    plates = master_json['plates']
    i=0
    for plate in plates:
        if plate.get("plate_type") == templateTypeEnum.PPT_Template:
            plate["plate_details"] = templates[i].model_dump()
            i+=1

    return plates

# Pass template number and transcript to regenerate response
# This function will return the json format of {plate_details} - refer LLM_2_ppt.py for the schema
async def regenerate_response(template_number: str, transcript: str) -> str:
    vectorstore = create_vector_store()
    regen_prompt = f"Use template {template_number} for the transcript: {transcript}"
    template = await query_with_pps_format(vectorstore, regen_prompt)
    
    return template.model_dump()

async def regenerate_response_for_list(plates, existing_plates):
    # If plates is a JSON string, parse it
    if isinstance(plates, str):
        plates = json.loads(plates)

    # Map plate_no to plate dict for quick lookup
    plates_by_no = {plate['plate_no']: plate for plate in plates}

    new_plates = []
    for plate in existing_plates:
        plate_no = plate.get('plate_no')
        if plate_no in plates_by_no:
            regenerated = {}
            # Regenerate using the updated transcript and template_number
            updated = plates_by_no[plate_no]
            print("Template #",plate_no, "to be updated with ", updated['template_number'])
            updated_plate = plate.copy()

            # Don't send request to LLM if template is either Faceshot or Graphics
            if not (updated['template_number'] == "Faceshot" or updated['template_number'] == "Graphics"):
                regenerated = await regenerate_response(updated['template_number'], updated['transcript'])
            else:
                # Update the plate_type
                updated_plate['plate_type'] = updated['template_number']

            #print("Updated plate_details: ", regenerated)
            # Preserve the original plate structure, updating plate_details
            updated_plate['plate_details'] = regenerated
                
            new_plates.append(updated_plate)
        else:
            new_plates.append(plate)
    return new_plates