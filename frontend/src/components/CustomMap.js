import React, { useEffect, useState, useRef } from "react";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [addPinMode, setAddPinMode] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState(null);
  const [newPinDesc, setNewPinDesc] = useState("");
  const [newPinCategory, setNewPinCategory] = useState("Lore");

  const imgRef = useRef(null);

  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then((res) => res.json())
      .then((data) => setPins(data));
  }, [backendUrl]);

  const zoomStep = 0.25;
  const zoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, 5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, 0.5));

  const getColor = (category) => {
    switch ((category || "").toLowerCase()) {
      case "lore":
        return "blue";
      case "quest":
        return "green";
      case "raid":
        return "red";
      case "dungeon":
        return "purple";
      default:
        return "gray";
    }
  };

  const handleMapClick = (e) => {
    if (!addPinMode || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setNewPinCoords({ x, y });
  };

  const handleSavePin = async () => {
    if (!newPinCoords || !newPinDesc) return;

    const newPin = {
      x: newPinCoords.x,
      y: newPinCoords.y,
      description: newPinDesc,
      category: newPinCategory,
    };

    const res = await fetch(`${backendUrl}/pins/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPin),
    });
    const savedPin = await res.json();
    setPins([...pins, savedPin]);

    setAddPinMode(false);
    setNewPinCoords(null);
    setNewPinDesc("");
    setNewPinCategory("Lore");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          border: "2px solid black",
        }}
      >
        <img
            ref={imgRef}
            src="/map.jpg"
            alt="Map"
            onClick={handleMapClick}
            style={{
                display: "block",
                width: `${zoom * 100}%`,           // fills container width
                maxWidth: "100vw",       // does not exceed viewport width
                maxHeight: "100vh",      // does not exceed viewport height
                height: "auto",          // keeps aspect ratio
                objectFit: "contain",    // ensures no stretching
                cursor: addPinMode ? "crosshair" : "default"
            }}
        />

        {/* Buttons inside map */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <button onClick={() => setAddPinMode(true)}>Add Pin</button>
          <button onClick={zoomIn}>Zoom In</button>
          <button onClick={zoomOut}>Zoom Out</button>
        </div>

        {/* Existing pins */}
        {imgRef.current &&
          pins.map((pin) => {
            const imgRect = imgRef.current.getBoundingClientRect();
            return (
              <div
                key={pin.id}
                title={`${pin.category}: ${pin.description}`}
                style={{
                  position: "absolute",
                  left: `${pin.x * 100 * zoom}%`,
                  top: `${pin.y * 100 * zoom}%`,
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  border: "1px solid black",
                  backgroundColor: getColor(pin.category),
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  cursor: "pointer",
                }}
              />
            );
          })}

        {/* New Pin popup */}
        {addPinMode && newPinCoords && (
          <div
            style={{
              position: "absolute",
              left: `${newPinCoords.x * 100}%`,
              top: `${newPinCoords.y * 100}%`,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.95)",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid black",
              zIndex: 30,
            }}
          >
            <div>
              <label>Description:</label>
              <input
                type="text"
                value={newPinDesc}
                onChange={(e) => setNewPinDesc(e.target.value)}
                style={{ width: "150px" }}
              />
            </div>
            <div style={{ marginTop: "5px" }}>
              <label>Category:</label>
              <select
                value={newPinCategory}
                onChange={(e) => setNewPinCategory(e.target.value)}
              >
                <option>Lore</option>
                <option>Quest</option>
                <option>Raid</option>
                <option>Dungeon</option>
              </select>
            </div>
            <button onClick={handleSavePin} style={{ marginTop: "5px" }}>
              Save Pin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomMap;
