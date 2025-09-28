import React, { useEffect, useState } from "react";

function PinsList({ backendUrl }) {
  const [pins, setPins] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then(res => res.json())
      .then(data => setPins(data));
  }, [backendUrl]);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>All Pins</h2>
      <ul>
        {pins.map((pin) => (
          <li key={pin.id}>
            <strong>({(pin.x*100).toFixed(1)}%, {(pin.y*100).toFixed(1)}%)</strong> - {pin.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PinsList;
