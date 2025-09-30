import axios from "axios"
import { useEffect,useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import NewGame from "./functions/new_game.js";
export default function HomeScreen(){
const nav=useNavigate();

const [username,setUsername]=useState("");

async function fetch_userData(){
try{
const token=localStorage.getItem("token")
if(token){
const res= await axios.get("http://localhost:8000/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
console.log(res);
if(res){
    setUsername(res.data.username)
}
}
else{
    console.error({"error":"token not found"})
}
}
catch(e){
    console.error({"error":e})
}
    
}

function logout(){
   localStorage.setItem("token",null);
nav("/login")
}

useEffect(()=>{
    fetch_userData();
},[])

    return (<>
    <h1>The Forest</h1>
   {username&&<h1>Welcome {username}</h1>} 
   <button onClick={()=>NewGame()}>new game</button>
   <button onClick={()=>{logout()}}>logout</button>
   
    </>)
}