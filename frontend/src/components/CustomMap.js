import React, { useEffect, useState } from "react";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then(res => res.json())
      .then(data => setPins(data));
  }, [backendUrl]);

  const handleMapClick = async (e) => {
    const map = e.target.getBoundingClientRect();
    const x = (e.clientX - map.left) / map.width;
    const y = (e.clientY - map.top) / map.height;

    const description = prompt("Enter a description for this pin:");
    if (!description) return;

    const newPin = { x, y, description };

    // Save to backend
    const res = await fetch(`${backendUrl}/pins/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPin),
    });
    const savedPin = await res.json();

    setPins([...pins, savedPin]);
  };

  return (
    <div style={{ position: "relative", width: "80%", margin: "auto" }}>
      <img
        src="/map.jpg"
        alt="Map"
        style={{ width: "100%", display: "block" }}
        onClick={handleMapClick}
      />
      {pins.map((pin) => (
        <div
          key={pin.id}
          title={pin.description}
          style={{
            position: "absolute",
            top: `${pin.y * 100}%`,
            left: `${pin.x * 100}%`,
            transform: "translate(-50%, -50%)",
            width: "15px",
            height: "15px",
            backgroundColor: "red",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}

export default CustomMap;
