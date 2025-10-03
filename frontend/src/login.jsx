import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const username = useRef(null);
  const password = useRef(null);

  async function post(e) {
    e.preventDefault();
    console.log(username.current.value);
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        username: username.current.value,
        password: password.current.value,
      });

      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
        nav("/home");
      }
    } catch (e) {
      console.error("error :", e);
    }
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #000000, #1a1a1a)",
          color: "white",
          fontFamily: "'Creepster', cursive",
        }}
      >


        <div
          style={{
            padding: "2rem",
            borderRadius: "12px",
            background: "rgba(20,20,20,0.85)",
            boxShadow: "0 0 25px rgba(255,0,0,0.3)",
            width: "350px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#ff0000", marginBottom: "1rem" }}>
            The Forest – Login
          </h1>

          <form
            onSubmit={post}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              ref={username}
              type="text"
              placeholder="username"
              style={{
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #444",
                background: "#111",
                color: "#fff",
              }}
            />
            <input
              ref={password}
              type="password"
              placeholder="password"
              style={{
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #444",
                background: "#111",
                color: "#fff",
              }}
            />
            <button
              type="submit"
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
              Login
            </button>
          </form>

          <button
            onClick={() => nav("/")}
            style={{
              marginTop: "1rem",
              padding: "0.6rem",
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
            Go to Signup
          </button>
        </div>
      </div>
    </>
  );
}
