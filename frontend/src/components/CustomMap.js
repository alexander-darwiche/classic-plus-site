import React, { useState, useEffect, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);
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
    if (!addPinMode) return;

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
    <div style={{ width: "100vw", height: "100vh" }}>
      <TransformWrapper
        minScale={0.5}
        maxScale={3}
        initialScale={1}
        wheel={{ step: 0.1 }} // mouse wheel zoom sensitivity
        pinch={{ step: 5 }}    // touch pinch sensitivity
        doubleClick={{ disabled: true }} // disable zoom on double click
        panning={{ velocityDisabled: true }} // smoother panning
      >
        <TransformComponent>
          <div style={{ position: "relative" }}>
            <img
              ref={imgRef}
              src="/map.jpg"
              alt="Map"
              onClick={handleMapClick}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                cursor: addPinMode ? "crosshair" : "default",
              }}
            />

            {/* Pins */}
            {pins.map((pin) => (
              <div
                key={pin.id}
                title={`${pin.category}: ${pin.description}`}
                style={{
                  position: "absolute",
                  left: `${pin.x * 100}%`,
                  top: `${pin.y * 100}%`,
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  border: "1px solid black",
                  backgroundColor: getColor(pin.category),
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              />
            ))}

            {/* New Pin Popup */}
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
        </TransformComponent>
      </TransformWrapper>

      {/* Add Pin Button fixed on screen */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <button onClick={() => setAddPinMode(true)}>Add Pin</button>
      </div>
    </div>
  );
}

export default CustomMap;

