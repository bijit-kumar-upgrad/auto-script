from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import asyncio

from app.prompts import GRAPHICS_PROMPT, SYSTEM_INSTRUCTION

class Point(BaseModel):
    text: str = Field(description="The point text (Title Case).")
    subpoints: Optional[List[str]] = Field(description="List of subpoints under this point. Optional for all templates with points.")

class Subheading(BaseModel):
    subheadingText: str = Field(description="The subheading text (Title Case).")
    descriptiveText: Optional[str] = Field(description="The text to be displayed under the subheading, mandatory for templates 4,8,9,17,20,22,27.")
    icon: Optional[str] = Field(description="A verbal description of the icon to be used, mandatory for templates 1,2,5,16,21,22,23.")
    image: Optional[str] = Field(description="A verbal description of the image to be used, mandatory for templates 8,17,27.")
    points: Optional[List[Point]] = Field(description="List of points under this subheading. mandatory for templates 1,2,5,6,7,10,16.")

class PlateContent(BaseModel):
    heading: Optional[str] = Field(description="Main heading for the plate (ALL CAPS). Mandatory for templates 1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,27.")
    descriptiveText: Optional[str] = Field(description="The text to be displayed on the slide, mandatory for templates 11,12,13,14,15,24,25,26,28,29.")
    subheadings: Optional[List[Subheading]] = Field(description="Array of subheadings. mandatory for templates 1,2,4,5,6,7,8,9,10,16,17,19,20,21,22,23")

class PlateDetails(BaseModel):
    """Main response structure matching PlateDetails schema"""
    template_number: str = Field(description="The template number provided in the context")
    reasoning: str = Field(description="The reason behind choosing this particular template number.")
    plate_content: Optional[PlateContent] = Field(description="The simplified formatted content for the chosen template.")

async def query_with_pps_format(vectorstore, transcript: str, k: int = 5):
    """Asynchronoulsy query vectorstore and return structured PPS format response"""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=1.0, max_tokens=2000)
    
    print("Sending request...")
    # Retrieve relevant documents
    docs = await asyncio.to_thread(lambda: vectorstore.similarity_search(transcript, k=k))

    if not docs:
        print("No docs")
        return PlateDetails(plates=[])
    #print("Docs")
    #print(docs)

    # Combine context
    #-------------------------------------
    context = "\n\n".join([f"Option {i+1}: {doc.page_content}" for i, doc in enumerate(docs)])
    escaped_context = context.replace('{', '{{').replace('}', '}}')
    
    prompt_template = f"""
    Use one of the following templates to convert the transcript into PPS format:

    Templates: {escaped_context}

    Transcript to convert: {transcript}

    Please follow the PPS creation guidelines and return the appropriate template structure.
    """
    system_prompt = SystemMessagePromptTemplate.from_template(SYSTEM_INSTRUCTION)
    human_prompt = HumanMessagePromptTemplate.from_template(f"""
    {SYSTEM_INSTRUCTION}
    Use one of the following templates to convert the transcript into PPS format:

    Templates: {escaped_context}

    Transcript to convert: {transcript}

    Please follow the PPS creation guidelines and return the appropriate template structure.
    """)

    prompt = ChatPromptTemplate.from_messages([system_prompt, human_prompt])
    
    #-------------------------------------

    structured_llm = llm.with_structured_output(PlateDetails)
    #-------------------------------------

    # Create the chain
    chain = prompt | structured_llm

    # Get response
    response = await chain.ainvoke({
        "escaped_context": escaped_context,
        "transcript": transcript
    })

    #print(response)

    # Response is already a PPSMasterResponse object, no JSON parsing needed
    return response    


#20250824 - Gowdham
def regen_graphics_response(transcript: str) :
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5)
    
    messages = [
        SystemMessage(GRAPHICS_PROMPT),
        HumanMessage(f"Suggest graphics for the following transcript: {transcript}"),
    ]

    master_response = llm.invoke(messages)

    return master_response