from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import RetrievalQA
from typing import List, Optional
import json
from langchain_core.messages import HumanMessage, SystemMessage
from .prompts import get_master_prompt
from typing import List, Dict

from enum import Enum, IntEnum

class templateTypeEnum(str, Enum):
    faceshot = 'faceshot'
    PPT_Template = 'PPT_Template'
    graphics='graphics'

class Plate(BaseModel):
    plate_no: int = Field(description="The plate number starting from 1.")
    transcript: str = Field(description="The snippet of the transcript belonging to this plate.")
    plate_type: templateTypeEnum = Field(description="The type of plate, choose beten faceshot, PPT_Template and graphics")
    description: str = Field(description="Detailed description of the the graphics/PPT Template, return blank if faceshot")

class PPSMasterResponse(BaseModel):
    """Main response structure matching PPS_MASTER_SIMPLIFIED schema"""
    plates: List[Plate] = Field(description="Array of plates with their content and template information")

    def to_json(self, indent: Optional[int] = None, exclude_none: bool = True) -> str:

        return json.dumps(
            self.model_dump(exclude_none=exclude_none),
            indent=indent,
            ensure_ascii=False
        )

    def to_dict(self, exclude_none: bool = True) -> dict:
        """
        Convert the PPSMasterResponse object to a dictionary.

        Args:
            exclude_none: Whether to exclude None values from the output

        Returns:
            Dictionary representation of the object
        """
        return self.model_dump(exclude_none=exclude_none)

def master_response(transcript: str, faceshot_template_split) -> PPSMasterResponse:
    print("Generating master response...")
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    
    master_prompt = get_master_prompt(faceshot_template_split)

    messages = [
        SystemMessage(master_prompt),
        HumanMessage(transcript),
    ]
    master_llm = llm.with_structured_output(PPSMasterResponse)
    master_response = master_llm.invoke(messages)

    return master_response


def get_template_plates_summary(master_response: PPSMasterResponse) -> List[Dict[str, object]]:
    return [
        {"plate_no": plate.plate_no, "transcript": plate.transcript}
        for plate in master_response.plates
        if plate.plate_type is templateTypeEnum.PPT_Template
    ]