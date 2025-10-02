from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from dotenv import load_dotenv
import os
load_dotenv()

password_contex=CryptContext(schemes=["bcrypt"],deprecated="auto")

ACCESS_EXPIRE= int(os.getenv('ACCESS_TOKEN_EXPIRES_IN', '300'))
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"


def password_hasing(password:str) -> str:

    return password_contex.hash(password)

def verify_password(password:str,hased_password:str) ->bool:

    return password_contex.verify(password,hased_password)

def create_jwt(username:dict)->str:
    to_encode=username.copy()
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_EXPIRE)
    to_encode.update({"exp":expire})

    return jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM) # type: ignore