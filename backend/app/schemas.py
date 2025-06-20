from pydantic import BaseModel
from typing import List, Dict, Any

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    temperature: float = 1.0
    top_p: float = 1.0

class ChatResponse(BaseModel):
    response: str