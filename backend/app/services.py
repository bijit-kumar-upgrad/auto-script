from langchain import hub
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing_extensions import List, TypedDict
from .LLM_1_Master import master_response,get_template_plates_summary, templateTypeEnum
from .LLM_2_ppt import query_with_pps_format
from .create_vector_store import create_vector_store
import json

# Function to get the AI response
def get_ai_response(input_script, processing_options) -> str:

    vectorstore = create_vector_store()

    master_response_var = master_response(input_script, processing_options)
    template_plates = get_template_plates_summary(master_response_var)

    templates = []
    for plate in template_plates:
        template = query_with_pps_format(vectorstore, plate['transcript'])
        templates.append(template)
    
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
def regenerate_response(template_number: str, transcript: str) -> str:
    vectorstore = create_vector_store()
    regen_prompt = f"Use template {template_number} for the transcript: {transcript}"
    template = query_with_pps_format(vectorstore, regen_prompt)
    
    return template.model_dump()

def regenerate_response_for_list(plates, existing_plates):
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
            print("Updated template #",updated['template_number'])
            if not (updated['template_number'] == "Faceshot" or updated["template_number"] == "Graphics"):
                regenerated = regenerate_response(updated['template_number'], updated['transcript'])
            # Preserve the original plate structure, updating plate_details
            plate_copy = plate.copy()
            plate_copy['plate_details'] = regenerated
            new_plates.append(plate_copy)
        else:
            new_plates.append(plate)
    return new_plates

'''
def regenerate_response_for_list(plates, existing_plates):
    changed_plate_nos = [plate['plate_no'] for plate in plates]
    changed_plates = dict(zip(changed_plate_nos, plates))
    new_plates = []
    for plate in existing_plates:
        if plate['plate_no'] in changed_plate_nos:
            new_plates.append(regenerate_response(changed_plates[plate['plate_no']]['template_number'], changed_plates[plate['plate_no']]['transcript']))
        else:
            new_plates.append(plate)
    return new_plates
'''
