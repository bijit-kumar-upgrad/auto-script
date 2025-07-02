from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain.prompts import ChatPromptTemplate

class Point(BaseModel):
    text: str = Field(description="The point text (Title Case).")
    subpoints: Optional[List[str]] = Field(description="List of subpoints under this point. Optional for all templates with points.")

class Subheading(BaseModel):
    subheadingText: str = Field(description="The subheading text (Title Case).")
    descriptiveText: Optional[str] = Field(description="The description text, mandatory for templates 4,8,9,17,20,22,27.")
    icon: Optional[str] = Field(description="A verbal description of the icon to be used, mandatory for templates 1,2,5,16,21,22,23.")
    image: Optional[str] = Field(description="A verbal description of the image to be used, mandatory for templates 8,17,27.")
    points: Optional[List[Point]] = Field(description="List of points under this subheading. mandatory for templates 1,2,5,6,7,10,16.")

class PlateContent(BaseModel):
    heading: Optional[str] = Field(description="Main heading for the plate (ALL CAPS). Mandatory for templates 1,2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,27.")
    descriptiveText: Optional[str] = Field(description="The main description text, mandatory for templates 11,12,13,14,15,24,25,26,28,29.")
    subheadings: Optional[List[Subheading]] = Field(description="Array of subheadings. mandatory for templates 1,2,4,5,6,7,8,9,10,16,17,19,20,21,22,23")

class PlateDetails(BaseModel):
    """Main response structure matching PlateDetails schema"""
    template_number: str = Field(description="The template number provided in the context")
    reasoning: str = Field(description="The reason behind choosing this particular template number.")
    plate_content: Optional[PlateContent] = Field(description="The simplified formatted content for the chosen template.")

def query_with_pps_format(vectorstore, question: str, k: int = 5):
    """Query vectorstore and return structured PPS format response"""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

    print("Sending request...")
    # Retrieve relevant documents
    docs = vectorstore.similarity_search(question)

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
    Use the following context to convert the transcript into PPS format:

    Context: {escaped_context}

    Transcript to convert: {question}

    Please follow the PPS creation guidelines and return the appropriate template structure.
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)

    #-------------------------------------

    structured_llm = llm.with_structured_output(PlateDetails)
    #-------------------------------------

    # Create the chain
    chain = prompt | structured_llm

    # Get response
    response = chain.invoke({
        "context": escaped_context,
        "question": question
    })

    #print(response)

    # Response is already a PPSMasterResponse object, no JSON parsing needed
    return response