from pydantic import BaseModel
from typing import List
class UserLogin(BaseModel):
    username:str
    password:str


class UserLevelData(BaseModel):
    character_eval:str
    conversations:dict
    
class NextChapter(BaseModel):
    chapter:int
