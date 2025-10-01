from pydantic import BaseModel
from typing import List
class UserLogin(BaseModel):
    username:str
    password:str

class conversations(BaseModel):
    chapter:str
    llm:str
    player:str

class UserInDB(BaseModel):
    username:str
    password:str
    character_eval:str
    chapter:str
    conversations:List[conversations]
    
class NextChapter(BaseModel):
    chapter:int
