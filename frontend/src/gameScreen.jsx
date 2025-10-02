import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameScreen() {
  const [current_chap, setCurrentChap] = useState(0);
  const [current_story, setCurrentStory] = useState("");
  const nav=useNavigate();

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
      console.log(res.data);
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
      console.log(current_chap)
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
      console.log(res.data);
      setCurrentStory(res.data.story.story)
    })();
  }, [current_chap]);
function get_options(){
   const token = localStorage.getItem("token");
  (async()=>{
    const res=await axios.get("http://localhost:8000/options", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res)
  })()
}
  return (
    <div>
      <h1>Chapter: {current_chap}</h1>
      <h2>{current_story}</h2>
      <button onClick={()=>get_options()}>Choose action</button>
      {/* Fix: pass function reference, do not mutate state directly */}
      <button onClick={() => setCurrentChap((c) => c + 1)}>Next</button>
      <button onClick={()=>nav('/home')}>Home</button>
    </div>
  );
}
