import React, { useEffect, useState, useRef } from "react";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [addPinMode, setAddPinMode] = useState(false);
  const [newPinCoords, setNewPinCoords] = useState(null);
  const [newPinDesc, setNewPinDesc] = useState("");
  const [newPinCategory, setNewPinCategory] = useState("Lore");

  const mapContainerRef = useRef(null);

  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then(res => res.json())
      .then(data => setPins(data));
  }, [backendUrl]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));

  const getColor = (pin_category) => {
    switch ((pin_category || "").toLowerCase()) {
      case "lore": return "blue";
      case "quest": return "green";
      case "raid": return "red";
      case "dungeon": return "purple";
      default: return "gray";
    }
  };  

  const handleMapClick = (e) => {
    if (!addPinMode) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
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
        pin_category: newPinCategory,
    };

    const res = await fetch(`${backendUrl}/pins/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPin),
    });
    const savedPin = await res.json();
    setPins([...pins, savedPin]);

    // Reset
    setAddPinMode(false);
    setNewPinCoords(null);
    setNewPinDesc("");
    setNewPinCategory("Lore");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={() => setAddPinMode(true)} style={{ margin: "10px" }}>Add Pin</button>
      <div style={{ margin: "10px" }}>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut} style={{ marginLeft: "10px" }}>Zoom Out</button>
      </div>

      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        style={{
          position: "relative",
          display: "inline-block",
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <img src="/map.jpg" alt="Map" style={{ display: "block" }} />

        {pins.map((pin) => (
          <div
            key={pin.id}
            title={`${pin.category}: ${pin.description}`}
            style={{
              position: "absolute",
              left: `${pin.x * 100}%`,
              top: `${pin.y * 100}%`,
              transform: `translate(-50%, -50%)`,
              width: "15px",
              height: "15px",
              backgroundColor: getColor(pin.category),
              borderRadius: "50%",
              border: "1px solid black",
              cursor: "pointer",
            }}
          />
        ))}

        {addPinMode && newPinCoords && (
          <div
            style={{
              position: "absolute",
              left: `${newPinCoords.x * 100}%`,
              top: `${newPinCoords.y * 100}%`,
              transform: "translate(-50%, -50%)",
              background: "rgba(255,255,255,0.9)",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid black",
              zIndex: 10,
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
            <button onClick={handleSavePin} style={{ marginTop: "5px" }}>Save Pin</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomMap;
