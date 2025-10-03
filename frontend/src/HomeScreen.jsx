import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewGame from "./functions/new_game.js";

export default function HomeScreen() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");

  async function fetch_userData() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://localhost:8000/userdata", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res);
        if (res) {
          setUsername(res.data.username);
        }
      } else {
        console.error({ error: "token not found" });
      }
    } catch (e) {
      console.error({ error: e });
    }
  }

  function logout() {
    localStorage.setItem("token", "");
    nav("/login");
  }

  function New_game() {
    if (localStorage.getItem("token") !== "") {
      NewGame();
      nav("/game");
    }
  }

  useEffect(() => {
    fetch_userData();
  }, []);

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #000000, #1a1a1a)",
          color: "white",
          fontFamily: "'Creepster', cursive",
          gap: "1rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#ff0000", marginBottom: "0.5rem" }}>
          The Forest
        </h1>
        {username ? (
          <h2 style={{ color: "#ff6666" }}>Welcome {username}</h2>
        ) : (
          <h2 style={{ color: "red" }}>
            User not found, please logout and login again
          </h2>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
            width: "250px",
          }}
        >
          <button
            onClick={New_game}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "none",
              background: "#ff0000",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#990000")}
            onMouseOut={(e) => (e.target.style.background = "#ff0000")}
          >
            New Game
          </button>

          <button
            onClick={() => nav("/game")}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "none",
              background: "#550000",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#330000")}
            onMouseOut={(e) => (e.target.style.background = "#550000")}
          >
            Continue
          </button>

          <button
            onClick={logout}
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #555",
              background: "#222",
              color: "#fff",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#333")}
            onMouseOut={(e) => (e.target.style.background = "#222")}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
