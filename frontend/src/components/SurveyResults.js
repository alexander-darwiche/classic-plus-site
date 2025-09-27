import React, { useEffect, useState } from "react";

function SurveyResults({ backendUrl }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/survey/`)
      .then(res => res.json())
      .then(data => setEntries(data));
  }, [backendUrl]);

  if (entries.length === 0) return <p>No survey entries yet.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "auto", textAlign: "left" }}>
      <h2>Survey Results</h2>
      <table border="1" cellPadding="5" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SurveyResults;
