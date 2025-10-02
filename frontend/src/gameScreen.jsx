import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameScreen() {
  const [current_chap, setCurrentChap] = useState(0);
  const [current_story, setCurrentStory] = useState("");
  const [options, setOptions] = useState([]);
  const [changeColor,setChangeColor]=useState(true);
  const [changeIdx,setChangeIdx]=useState(true);
  const [currentIdx,setCurrentIdx]=useState(4);
  const [fate,setFate]=useState("");
  const [nextVisible,setnextVisible]=useState(false);
  const nav = useNavigate();
  
  // Fetch initial data
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/all_user_data", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Initial user data:", res.data);
      setCurrentChap(Number(res.data.chapter));
      setCurrentStory(res.data.story.story);
    })();
  }, []);

  // Update backend whenever chapter changes
  useEffect(() => {
    if (current_chap === 0) return; // skip initial mount
    setCurrentStory("loading please wait");
    (async () => {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:8000/nextchapter",
        { chapter: current_chap },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Next chapter response:", res.data);
      setCurrentStory(res.data.story.story);
      setnextVisible(false);
    })();
  }, [current_chap]);

  // Fetch options and parse
  async function get_options() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/options", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let raw = res.data._options; // your backend field
      console.log("Raw _options:", raw);

     
      if (typeof raw === "string" && raw.startsWith('"') && raw.endsWith('"')) {
        raw = raw.slice(1, -1);
      }

      if (typeof raw === "string") {
        raw = raw.replace(/^```json\s*|```$/g, "").trim();
      }

      // 3️⃣ Parse JSON
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;

      console.log("Parsed JSON:", data);

      // 4️⃣ Handle misspelled key
      const opts = data.option_for_chapter || data.oprtion_for_chapter || [];
      console.log(opts[0]);
      setOptions(opts);
    } catch (err) {
      console.error("Failed to fetch or parse options:", err);
      setOptions([]);
    }
  }
function changeCorloring(e){

if(changeColor){e.target.style.color="red";
  setChangeColor(false)
  
}



}

function getIdx(key){
  if (changeIdx) {
  setCurrentIdx(k=>k=Number(key));
  setChangeIdx(false);
  }
  
  
}
useEffect(()=>{
  console.log(currentIdx);
 try{
   console.log(options[Number(currentIdx)-1].fate);
   setFate(options[Number(currentIdx)-1].fate);
   if (fate.includes("gameover")){
       setTimeout(() => {
         alert("you died ");
       }, 2000);
   }
   else {
        setTimeout(() => {
         
         setnextVisible(true);
       }, 2000);
   }
   
 }
 catch(e){

 }
  
},[currentIdx])
  return (
    <div>
      <button onClick={() => nav("/home")}>Home</button>
      <h1>Chapter: {current_chap}</h1>
      <h2>{current_story}</h2>

      <button onClick={() => get_options()}>Choose action</button>
     
      

      {/* Display options */}
      {options.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Options:</h3>
          {options.map((opt) => (
            <div key={opt.option} style={{ marginBottom: "1rem" }}>
              {/* <strong>Option {opt.option}:</strong> */}
              <button onClick={(e)=>{
                changeCorloring(e);
                getIdx(opt.option)
                
                
              }}><h2>{opt.action}</h2> </button>
             
            </div>
          ))}
        </div>
      )}

      {fate&&<div> <h1>Fate:{fate}</h1></div>}
      {nextVisible&& <button onClick={() => setCurrentChap((c) => c + 1)}>Next</button>}
    </div>
  );
}
