import axios from "axios";
export default async function NewGame(){

    try{
        const token =localStorage.getItem("token")
        console.log(token)
        const res=await axios.put("http://localhost:8000/newgame",{}, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res)
        return 1
    }
    catch (e){
        console.error(e)
        return 0
    }

    
}