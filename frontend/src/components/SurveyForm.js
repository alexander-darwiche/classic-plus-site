import React, { useState } from "react";

function SurveyForm({ backendUrl }) {
  const [formData, setFormData] = useState({
    name: "",
    previousVersions: [],
    scalingRaids: "",
    newRaceClass: "",
    currentlyPlay: "",
    intendToPlay: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // handle change for text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle multi-select checkboxes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updated = [...formData.previousVersions];
    if (checked) {
      updated.push(value);
    } else {
      updated = updated.filter((v) => v !== value);
    }
    setFormData({ ...formData, previousVersions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px auto" }}>
      {/* Name/Character */}
      <input
        name="name"
        placeholder="Name / Character"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "15px", width: "100%" }}
      />

      {/* Previous Versions (multi-select checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label><strong>What versions of Classic have you played before?</strong></label>
        <div>
          {["Hardcore", "SoD", "SoM", "Vanilla", "TBC", "WoTLK", "Cata", "MoP"].map((version) => (
            <label key={version} style={{ display: "block" }}>
              <input
                type="checkbox"
                value={version}
                checked={formData.previousVersions.includes(version)}
                onChange={handleCheckboxChange}
              />{" "}
              {version}
            </label>
          ))}
        </div>
      </div>

      {/* Scaling Raids */}
      <div style={{ marginBottom: "15px" }}>
        <label><strong>Do you think Classic Plus should have scaling difficulty levels in raids?</strong></label>
        <div>
          <label>
            <input
              type="radio"
              name="scalingRaids"
              value="Yes"
              checked={formData.scalingRaids === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="scalingRaids"
              value="No"
              checked={formData.scalingRaids === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
      </div>

      {/* New Race/Class */}
      <div style={{ marginBottom: "15px" }}>
        <label><strong>Do you think Classic Plus should have new race/class combinations?</strong></label>
        <div>
          <label>
            <input
              type="radio"
              name="newRaceClass"
              value="Yes"
              checked={formData.newRaceClass === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="newRaceClass"
              value="No"
              checked={formData.newRaceClass === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
      </div>

      {/* Currently Play */}
      <div style={{ marginBottom: "15px" }}>
        <label><strong>Do you currently play Classic?</strong></label>
        <div>
          <label>
            <input
              type="radio"
              name="currentlyPlay"
              value="Yes"
              checked={formData.currentlyPlay === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="currentlyPlay"
              value="No"
              checked={formData.currentlyPlay === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
      </div>

      {/* Intend to Play */}
      <div style={{ marginBottom: "15px" }}>
        <label><strong>Would you intend to play Classic Plus?</strong></label>
        <div>
          <label>
            <input
              type="radio"
              name="intendToPlay"
              value="Yes"
              checked={formData.intendToPlay === "Yes"}
              onChange={handleChange}
              required
            />{" "}
            Yes
          </label>
          <label style={{ marginLeft: "15px" }}>
            <input
              type="radio"
              name="intendToPlay"
              value="No"
              checked={formData.intendToPlay === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
      </div>

      <button type="submit">Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default SurveyForm;
