import jwt
import os
from dotenv import load_dotenv
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from src.config.db import client
load_dotenv()
ACCESS_EXPIRE= int(os.getenv('ACCESS_TOKEN_EXPIRES_IN', '300'))
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
async def use_token(token:str=Depends(oauth2_scheme)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM]) # type: ignore
        username=payload.get("sub")
        if username:
            user=client.The_forest.user_data.find_one({"username":username})
            return user
        else:
            return {"message":"invalid/not found username in the token"}
    except:
        return {"message":"Invalid token"}