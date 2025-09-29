from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import jwt
from dotenv import load_dotenv
import os
load_dotenv()

password_contex=CryptContext(schemes=["bcrypt"],deprecated="auto")


def password_hasing(password:str) -> str:

    return password_contex.hash(password)

def verify_password(password:str,hased_password:str) ->bool:

    return password_contex.verify(password,hased_password)

# def create_jwt(username:dict)->str: