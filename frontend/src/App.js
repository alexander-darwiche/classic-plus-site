import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import SurveyPage from "./components/SurveyPage";
import SurveyResults from "./components/SurveyResults";
const backendUrl = "https://classic-plus-site.onrender.com";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/results" element={<SurveyResults backendUrl={backendUrl} />} />
      </Routes>
    </Router>
  );
}

export default App;
