import axios from "axios"
import { useRef,useState } from "react"
import {useNavigate } from "react-router-dom";
export default function Login(){
    const nav=useNavigate ();
    const username=useRef(null);
    const password=useRef(null);
async function post(e){
    e.preventDefault();
console.log(username.current.value)
try{
  const res= await axios.post("http://127.0.0.1:8000/login",{
  "username": username.current.value,
  "password": password.current.value
});

if(res.data.access_token){
localStorage.setItem("token",res.data.access_token);
nav("/home")

}

}
catch(e){
    console.error("error :",e)
}
  




}



    return (
        <>
        <div>
            <form onSubmit={post} >
            <input ref={username} type="text" placeholder="username" />
            <input ref={password} type="text" placeholder="password" />
            <button type="submit">Login</button>
            </form>
        </div>
        </>
    )

}