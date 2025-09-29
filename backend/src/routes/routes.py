from fastapi import APIRouter
from src.config.db import client
from src.models.models import UserLogin 
from src.functions.encryption import password_hasing ,verify_password
Route=APIRouter()

try:
     client.The_forest.user_data.create_index("username", unique=True)
     print("username is uinque")
except Exception as e:
     print(e)

@Route.get("/welcome")
def First_msg():
    return {"message":"hello and welcome"}

@Route.post("/signin")
def sign_in(user:UserLogin):
     
     user.password=password_hasing(user.password)
     try:
         client.The_forest.user_data.insert_one(dict(user))
         return {"message":"user created"}

     except Exception as e:
          print(e)
          return e

@Route.post("/login")
def login (user:UserLogin):
     try:
           found=client.The_forest.user_data.find_one({"username":user.username})
     except Exception as e:
          print(e)
          return {"message":str(e)}
     finally :
          if found:
               if verify_password(user.password,found.get("password")):
                    return {"message":"login sucess"}
               else :
                    return {"message":"wrong password"}
           
