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
      .then((res) => res.json())
      .then((data) => setPins(data));
  }, [backendUrl]);

  const zoomStep = 0.5; // faster zoom
  const zoomIn = () => setZoom((prev) => Math.min(prev + zoomStep, 5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - zoomStep, 0.5));

  const getColor = (pin_category) => {
    switch ((pin_category || "").toLowerCase()) {
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

    setAddPinMode(false);
    setNewPinCoords(null);
    setNewPinDesc("");
    setNewPinCategory("Lore");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        style={{
          position: "relative",
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflow: "hidden",
          border: "2px solid black",
        }}
      >
        {/* Map Image */}
        <img
          src="/map.jpg"
          alt="Map"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
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
        {pins.map((pin) => (
          <div
            key={pin.id}
            title={`${pin.pin_category}: ${pin.description}`}
            style={{
              position: "absolute",
              left: `${pin.x * 100}%`,
              top: `${pin.y * 100}%`,
              transform: `translate(-50%, -50%) scale(${zoom})`,
              width: "15px",
              height: "15px",
              backgroundColor: getColor(pin.pin_category),
              borderRadius: "50%",
              border: "1px solid black",
              cursor: "pointer",
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
              background: "rgba(255,255,255,0.9)",
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
