
import React, { useState } from "react";
const backendUrl = "https://classic-plus-site.onrender.com";

function SurveyForm({ backendUrl }) {
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // clear previous errors

    try {
      const response = await fetch(`${backendUrl}/survey/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Backend error:", errText);
        setError("Failed to submit survey.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Check console for details.");
    }
  };

  if (submitted) return <h2>Thank you for your feedback!</h2>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "20px auto" }}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <textarea name="feedback" placeholder="Your feedback" value={formData.feedback} onChange={handleChange} required />
      <button type="submit">Submit</button>
      {error && <p style={{color:"red"}}>{error}</p>}
    </form>
  );
}

export default SurveyForm;
