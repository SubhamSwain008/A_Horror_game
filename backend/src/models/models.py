from pydantic import BaseModel
from typing import List
class UserLogin(BaseModel):
    username:str
    password:str

class conversations(BaseModel):
    chapter:int
    options:str
    selected:str

class evaluation(BaseModel):
    chapter:int
    character_evalutaion:str

class UserInDB(BaseModel):
    username:str
    character_eval:List[evaluation]
    chapter:int
    conversations:List[conversations]
    
class NextChapter(BaseModel):
    chapter:int
