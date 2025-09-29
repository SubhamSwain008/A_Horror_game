from fastapi import APIRouter


Route=APIRouter()


@Route.get("/welcome")
def First_msg():
    return {"message":"hello and welcome"}