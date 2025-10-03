from fastapi import APIRouter,Depends
from src.config.db import client
from src.models.models import UserLogin ,NextChapter,UserLevelData
from src.functions.encryption import password_hasing ,verify_password, create_jwt
from src.auth.auth import use_token
from story import story_array
from src.functions.llm import get_options
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
def signup(user:UserLogin):
     
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
           "character_eval":[{"chapter":-1,"character_evalutaion":"none"},],
   "chapter":0,
    "conversations":[{"chapter":-1,"options":"none"}],
      }
      updated=client.The_forest.user_data.update_one({"username":current["username"]},
                                                     {"$set":updates})
      
      if updated.modified_count!=0:
           return {"_message":"new game initiated"}
      else :
           return {"_message":"new game not initiated"}
     
@Route.get("/all_user_data")
async def user_profile(current:dict=Depends(use_token)):

      user=client.The_forest.user_data.find_one({"username":current["username"]})
      if not user:
           return {"_message":"user not found may be try login first"}
      
     #  print(user)
      user_data={'username':user['username'],
                 'chapter':user['chapter'],
                 'story':story_array[user['chapter']]
                 }
      return user_data
      
@Route.put("/nextchapter")
async def next_chapter(chapter:NextChapter,current:dict=Depends(use_token)):
     print(chapter.chapter,len(story_array))
     user=client.The_forest.user_data.find_one({"username":current["username"]})
     

     if not user:
           return {"_message":"user not found may be try login first"}
     if chapter.chapter<len(story_array):
          updates={"chapter":chapter.chapter}
          updated=client.The_forest.user_data.update_one({"username":current["username"]},
                                                       {"$set":updates})
          return {'story':story_array[chapter.chapter]}
     else:
          updates={"chapter":0}
          updated=client.The_forest.user_data.update_one({"username":current["username"]},
                                                     {"$set":updates})
          return {'story':{"story":"End cerdits"}}

@Route.get('/options')
async def get_options_for(current: dict = Depends(use_token)):
    try:
        # Fetch user document
        user = client.The_forest.user_data.find_one({"username": current["username"]})
        if not user:
            return {"_message": "user not found"}

        print(user['username'], user.get('chapter'), user.get('character_eval'), user.get('conversations'))
        options=get_options(user.get('chapter'),user.get('character_eval'),user.get('conversations'),story_array)
        return {"_options": options}

    except Exception as e:
            print("LLM failed:", e)
            return {"_message": "llm failed"}


    
@Route.put('/userdata')
def get_user_updated_data(user:UserLevelData,current: dict = Depends(use_token)):
     
    
     upadted=client.The_forest.user_data.find_one({"username": current["username"]})
     print(upadted)
     if upadted:
          newcharEval={
          " chapter":upadted.get("chapter")-1,
          "character_evalutaion":user.character_eval
          }
          new_convo={
            "chapter":upadted.get("chapter")-1,
            "options":user.conversations,
          }
          result =client.The_forest.user_data.update_one(
        {"username": current["username"]},
        {
            "$push": {
                "character_eval":newcharEval,
                "conversations": new_convo
            }
        }
    )

     return {"_message":"sucessfully recived"}