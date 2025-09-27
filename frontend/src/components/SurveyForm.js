import React, { useState } from "react";

function SurveyForm() {
  const [formData, setFormData] = useState({ name: "", email: "", feedback: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://classic-plus-site.onrender.com//survey/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    });

    if(response.ok) setSubmitted(true);
  }

  if(submitted) return <h2>Thank you for your feedback!</h2>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <textarea name="feedback" placeholder="Your feedback" value={formData.feedback} onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SurveyForm;
