import React, { useEffect, useState } from "react";
import SurveyForm from "./components/SurveyForm";
import SurveyResults from "./components/SurveyResults";

function App() {
  const backendUrl = "https://classic-plus-site.onrender.com";
  const [view, setView] = useState("landing"); // "landing" or "results"
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/items/`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <nav>
        <button onClick={() => setView("landing")}>Home</button>
        <button onClick={() => setView("results")}>Survey Results</button>
      </nav>

      {view === "landing" && (
        <>
          <h1>Welcome to Classic Plus</h1>
          <p>Explore our items and share your feedback below!</p>

          <h2>Items from FastAPI</h2>
          <ul>
            {items.map(item => <li key={item.item_id}>{item.name}</li>)}
          </ul>

          <h2>Survey</h2>
          <SurveyForm backendUrl={backendUrl} />
        </>
      )}

      {view === "results" && <SurveyResults backendUrl={backendUrl} />}
    </div>
  );
}

export default App;
