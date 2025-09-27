import React from "react";
import SurveyForm from "./SurveyForm";

function LandingPage() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to Classic Plus</h1>
      <p>We are launching a survey soon. Share your feedback below!</p>
      <SurveyForm />
    </div>
  );
}

export default LandingPage;
