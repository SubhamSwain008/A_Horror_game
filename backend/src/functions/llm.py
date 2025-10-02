from typing import Union
from fastapi import FastAPI
from google import genai
import os
from dotenv import load_dotenv
from story import story_array

load_dotenv()

gen=os.getenv("GEMINI_KEYY")



def get_options(current_chapter:int,character:list,conversation:list,story:list)->str:
   

    client = genai.Client(api_key=gen)

    response = client.models.generate_content(
            model="gemini-2.5-flash",
        
            contents=f'''system-"I will be providing a story , your job is to give options to the user based on previous options options he selected.
            I will also provide his charcter evaluation based on previous options he selected,you will provide chacter evalution based on previous evaluation . you will give 3 option for each chapter . 
            you will aslo provide his fate based on each of 3 option , fate can be either death (game over) of a creative twist or anything that will directly 
            inegrate to next chapter . keep this formating - (option:number,action:"",fate:"fate here" if game over (gameover)"fate here ",character_evalution:"based on all previous ones") , you have to include at least 1 game over option but there can be 2. donot metion about future 
            chapters in fate but consider them while deciding. story is supernatural so even wildest and randomest imaginations is upon you. but 
            fates can't contradicts next chapter story and must maintain dailouges  (strict warning) , keep fates bit "
                
                here is the story :{story} ,
                character_evaluation:{character},
                choices_made_and_provied_options:{conversation},
               
    give options for :chapter {current_chapter}

    ''',
        )
    print(response.text)
    return str(response.text)

current=0
character=[{"chapter":-1,"character_evalutaion":"none"}]
conversation=[{"chapter":-1,"options":"none","selected":"none"}]
get_options(current,character,conversation,story_array)