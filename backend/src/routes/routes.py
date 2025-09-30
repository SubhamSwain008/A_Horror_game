from fastapi import APIRouter,Depends
from src.config.db import client
from src.models.models import UserLogin 
from src.functions.encryption import password_hasing ,verify_password, create_jwt
from src.auth.auth import use_token
Route=APIRouter()

try:
     client.The_forest.user_data.create_index("username", unique=True)
     print("username is uinque")
except Exception as e:
     print(e)

@Route.get("/welcome")
def First_msg():
    return {"message":"hello and welcome"}

@Route.post("/signup")
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
                    access_token=create_jwt(
                    username={"sub":found["username"]}
                    )
                    return {"access_token":access_token,"token_type":"bearer"}
               else :
                    return {"message":"wrong password"}
           
@Route.get("/userdata")
async def user_data(current:dict=Depends(use_token)):
     return{
          "username":current["username"],
     }

@Route.put("/newgame")
async def new_game(current:dict=Depends(use_token)):
      user=client.The_forest.user_data.find_one({"username":current["username"]})
      if not user:
           return {"_message":"user not found may be try login first"}
      
      updates={
           "character_eval":"beginer ",
   "chapter":0,
    "conversations":[],
      }
      updated=client.The_forest.user_data.update_one({"username":current["username"]},
                                                     {"$set":updates})
      
      if updated.modified_count!=0:
           return {"_message":"new game initiated"}
      else :
           return {"_message":"new game not initiated"}
      
           
