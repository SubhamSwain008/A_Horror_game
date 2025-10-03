import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DecryptedText from "../animation/DecryptedText/DecryptedText.jsx";
import BlurText from "../animation/BlurText/BlurText.jsx";
import img1 from "./assets/chapter1.png"
import img2 from "./assets/chapter2.png"
import img3 from "./assets/chapter3.png"
import img4 from "./assets/chapter4.png"
import img5 from "./assets/chapter5.png"

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
  const imagraa=[img1,img2,img3,img4,img5]
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
    setLoadingtext("wait protagonist is thinking options");
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
      maxWidth: "100vw",
      overflowX: "hidden",
      background: "linear-gradient(to bottom, #000000, #111111)",
      color: "white",
      fontFamily: "'Creepster', cursive, monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem 1rem",
      textAlign: "center",
      boxSizing: "border-box"
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
          left:"20px",
          top:"20px"
        }}
        onMouseOver={e => e.target.style.background = "#990000"}
        onMouseOut={e => e.target.style.background = "#ff0000"}
      >
        Home
      </button>

      <h1 style={{ margin: "4rem 0 0.5rem", maxWidth: "90vw", wordWrap: "break-word" }}>
        <DecryptedText text="Chapter:" animateOn="view" revealDirection="center"/>
        {current_chap}
      </h1>

      <img 
        src={imagraa[current_chap]} 
        alt={`Chapter ${current_chap}`}  
        style={{
          zIndex: 100,
          maxWidth: "90vw",
          maxHeight: "40vh",
          objectFit: "contain",
          margin: "1rem 0"
        }}
      />

      <h2 style={{
        margin: "0.5rem 0",
        maxWidth: "90vw",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        color:"rgba(235, 213, 44, 0.73)"
      }}>
        <BlurText
          text={current_story}
          delay={150}
          animateBy="words"
          direction="top"
          className="text-2xl mb-8"
        />
      </h2>

      {ifshowaction && 
        <button 
          onClick={() => {get_options(); setIfshowaction(false);}}
          style={{
            padding: "0.2rem 1rem",
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
          <h2>Choose action</h2>
        </button>
      }

      <h1 style={{ color: "#ff6666", margin: "1rem 0", maxWidth: "90vw", wordWrap: "break-word" }}>
        <DecryptedText text={loadingtext} animateOn="view" revealDirection="center"/>
      </h1>
 {fate && 
        <div style={{ color: "red", fontSize: "1.5rem", margin: "1rem 0", maxWidth: "90vw", wordWrap: "break-word" }}>
          <h3>
            Fate:
            <DecryptedText text={fate} animateOn="view" revealDirection="center"/>
          </h3>
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
      {options.length > 0 && (
        <div style={{ marginTop: "2rem", width: "100%", maxWidth: "600px", padding: "0 1rem", boxSizing: "border-box" }}>
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
                  maxWidth: "90vw",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={e => e.target.style.background = "#330000"}
                onMouseOut={e => e.target.style.background = "#550000"}
              >
                <h2 style={{ margin: 0, fontSize: "1.2rem", wordWrap: "break-word" }}>{opt.action}</h2>
              </button>
            </div>
          ))}
        </div>
      )}

     
    </div>
  );


}
