import React, { useEffect, useState } from "react";

function PinsList({ backendUrl }) {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then(res => res.json())
      .then(data => setPins(data))
      .catch(err => console.error("Failed to fetch pins:", err));
  }, [backendUrl]);

  const handleUpvote = (pinId) => {
    // TODO: implement voting logic
    console.log("Upvote pin", pinId);
  };

  const handleDownvote = (pinId) => {
    // TODO: implement voting logic
    console.log("Downvote pin", pinId);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>All Pins</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>#</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Description</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Category</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>X </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Y </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pins.map((pin, index) => (
            <tr key={pin.id}>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{index + 1}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{pin.description}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{pin.category}</td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {(pin.x * 100).toFixed(1)}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                {(pin.y * 100).toFixed(1)}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #eee", display: "flex", gap: "5px" }}>
                <button onClick={() => handleUpvote(pin.id)}>👍</button>
                <button onClick={() => handleDownvote(pin.id)}>👎</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PinsList;
