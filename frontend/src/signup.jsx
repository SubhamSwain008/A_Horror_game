import { useState,useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Signup(){
const nav=useNavigate();
const username=useRef(null);
const password=useRef(null);
const [message,setMessage]=useState("");

async function submit(e){
    e.preventDefault();
    try{
  const res= await axios.post("http://127.0.0.1:8000/signup",{
  "username": username.current.value,
  "password": password.current.value
});
console.log(res)
if(res.data.message){
setMessage(res.data.message);
 nav("/login")
}
else{
    setMessage("username already exist")
   
}


}
catch(e){
 console.error(e)
}
}


    return(<>
    <div>
       
        <form onSubmit={e=>submit(e)}>
            <input ref={username} type="text " placeholder="username" />
            <input ref={password} type="text" placeholder="password"/>
            <button type="submit">signin</button>


        </form>
         <h1 style={{color:"red"}}>{message}</h1>
    </div>
    </>)
}