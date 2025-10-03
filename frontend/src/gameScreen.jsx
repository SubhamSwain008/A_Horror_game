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
  const [ifshowaction,setIfshowaction]=useState(true);
  const [loadingtext,setLoadingtext]=useState("");
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
      // console.log("Initial user data:", res.data);
      setCurrentChap(Number(res.data.chapter));
      setCurrentStory(res.data.story.story);
    })();
  }, []);

  // Update backend whenever chapter changes
  useEffect(() => {
    if (current_chap === 0) return; // skip initial mount
     (async()=>{
          const token = localStorage.getItem("token");
          const res2 = await axios.put(
        "http://localhost:8000/userdata",
        { "character_eval": options[Number(currentIdx)-1].character_evalution,
          "conversations":{
            "options":options,
            "selected":currentIdx
          }

         },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(res2)
      })()
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
     
      // console.log("Next chapter response:", res.data);
      setChangeColor(true);
      setChangeIdx(true);
      setCurrentStory(res.data.story.story);
      setnextVisible(false);
      setOptions([])
      setFate("");
      setIfshowaction(true)
    })();
  }, [current_chap]);

  // Fetch options and parse
  async function get_options() {
    const token = localStorage.getItem("token");
    setLoadingtext("wait generating options");
    try {
      const res = await axios.get("http://localhost:8000/options", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      let raw = res.data._options; // your backend field
      // console.log("Raw _options:", raw);

     
      if (typeof raw === "string" && raw.startsWith('"') && raw.endsWith('"')) {
        raw = raw.slice(1, -1);
      }

      if (typeof raw === "string") {
        raw = raw.replace(/^```json\s*|```$/g, "").trim();
      }

      // 3️⃣ Parse JSON
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;

      // console.log("Parsed JSON:", data);

      // 4️⃣ Handle misspelled key
      const opts = data.option_for_chapter || data.oprtion_for_chapter || [];
      // console.log(opts[0]);
      setOptions(opts);
      setLoadingtext("")
    } catch (err) {
      console.error("Failed to fetch or parse options:", err);
      setOptions([]);
      setLoadingtext("")
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
  // console.log(currentIdx);
 try{
  //  console.log(options[Number(currentIdx)-1].character_evalution);
   setFate(options[Number(currentIdx)-1].fate);
   setOptions(prevOptions =>
  prevOptions.map(opt => {
    const { fate, ...rest } = opt;  // destructure, drop `fate`
    return rest;
  })
);
   // normalize to lowercase
const fateStr = String(options[Number(currentIdx)-1].fate).toLowerCase();

// remove spaces if needed (optional)
const normalized = fateStr.replace(/\s+/g, '');

// check if it contains "gameover"
if (normalized.includes("gameover")) {
  setTimeout(() => {
    alert("you died brat! click to reload the level");
    
    window.location.reload(true);
  }, 2000);
} else {
  // console.log(fate);
  setTimeout(() => {
    setnextVisible(true);
  }, 2000);
}

   
 }
 catch(e){

 }
  
},[currentIdx])
  return (
    
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #000000, #111111)",
    color: "white",
    fontFamily: "'Creepster', cursive, monospace",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center"
  }}>
    <button 
      onClick={() => nav("/home")}
      style={{
        padding: "0.8rem 1.2rem",
        borderRadius: "8px",
        border: "none",
        background: "#ff0000",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        margin: "0.5rem 0",
        transition: "all 0.3s ease",
        position:"absolute",
        left:"20px"
        

      }}
      onMouseOver={e => e.target.style.background = "#990000"}
      onMouseOut={e => e.target.style.background = "#ff0000"}
    >
      Home
    </button>

    <h1 style={{ margin: "0.5rem 0" }}>Chapter: {current_chap}</h1>
    <h2 style={{ margin: "0.5rem 0", maxWidth: "80%" }}>{current_story}</h2>

    {ifshowaction && 
      <button 
        onClick={() => {get_options(); setIfshowaction(false);}}
        style={{
          padding: "0.8rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          background: "#cc0000",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          margin: "0.5rem 0",
          transition: "all 0.3s ease"
        }}
        onMouseOver={e => e.target.style.background = "#990000"}
        onMouseOut={e => e.target.style.background = "#cc0000"}
      >
        Choose action
      </button>
    }

    <h1 style={{ color: "#ff6666", margin: "1rem 0" }}>{loadingtext}</h1>

    {options.length > 0 && (
      <div style={{ marginTop: "2rem", width: "80%", maxWidth: "600px" }}>
        <h3 style={{ marginBottom: "1rem" }}>Options:</h3>
        {options.map((opt) => (
          <div key={opt.option} style={{ marginBottom: "1rem" }}>
            <button
              onClick={(e) => {changeCorloring(e); getIdx(opt.option);}}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "6px",
                border: "none",
                background: "#550000",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
                transition: "all 0.3s ease"
              }}
              onMouseOver={e => e.target.style.background = "#330000"}
              onMouseOut={e => e.target.style.background = "#550000"}
            >
              <h2 style={{ margin: 0 }}>{opt.action}</h2>
            </button>
          </div>
        ))}
      </div>
    )}

    {fate && 
      <div style={{ color: "red", fontSize: "1.5rem", margin: "1rem 0" }}>
        <h3>Fate: {fate}</h3>
      </div>
    }

    {nextVisible &&
      <button 
        onClick={() => {setCurrentChap((c) => c + 1); window.location.reload(true);}}
        style={{
          padding: "0.8rem 1.2rem",
          borderRadius: "8px",
          border: "none",
          background: "#550000",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          margin: "0.5rem 0",
          transition: "all 0.3s ease"
        }}
        onMouseOver={e => e.target.style.background = "#330000"}
        onMouseOut={e => e.target.style.background = "#550000"}
      >
        Next
      </button>
    }
  </div>
);

}
