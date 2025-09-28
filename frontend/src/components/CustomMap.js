import React, { useState, useRef, useEffect } from "react";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);
  const [newPinCoords, setNewPinCoords] = useState(null);
  const [newPinDesc, setNewPinDesc] = useState("");
  const [newPinCategory, setNewPinCategory] = useState("Lore");

  const imgRef = useRef(null);


  // Fetch pins from backend when component mounts
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await fetch(`${backendUrl}/pins`);
        const data = await res.json();
        setPins(data);
      } catch (err) {
        console.error("Failed to fetch pins:", err);
      }
    };
    fetchPins();
  }, [backendUrl]);
  
  const getColor = (category) => {
    switch ((category || "").toLowerCase()) {
      case "lore": return "blue";
      case "quest": return "green";
      case "raid": return "red";
      case "dungeon": return "purple";
      default: return "gray";
    }
  };

  

//   const handleMapDoubleClick = (e) => {
//         // x and y in pixels relative to the viewport
//         const x = e.clientX;
//         const y = e.clientY;
      
//         setNewPinCoords({ x, y });
//     };
      

    const handleSavePin = async () => {
        if (!newPinCoords || !newPinDesc) return;
    
        const newPin = {
            x: newPinCoords.x,
            y: newPinCoords.y,
            description: newPinDesc,
            category: newPinCategory,
        };
    
        // Save to backend
        const res = await fetch(`${backendUrl}/pins/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPin),
        });
        const savedPin = await res.json();
    
        setPins([...pins, savedPin]);

        const updatedPins = [...pins, newPin];
        setPins(updatedPins);
        localStorage.setItem("pins", JSON.stringify(updatedPins));
    
        setNewPinCoords(null);
        setNewPinDesc("");
        setNewPinCategory("Lore");
    };
  

  const handleCancelPin = () => {
    setNewPinCoords(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "60px", // leave space for navbar
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          border: "2px solid black",
          maxWidth: "95vw",
          maxHeight: "calc(100vh - 60px)",
        }}
      >
        {/* Map Image */}
        <img
            ref={imgRef}
            src="/map.jpg"
            alt="Map"
            onDoubleClick={(e) => {
                const rect = imgRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                setNewPinCoords({ x, y }); // normalized 0-1 coordinates
            }}
            style={{
                display: "block",
                width: "100%",
                height: "auto",
                cursor: "crosshair",
            }}
        />

        {/* Existing Pins */}
        {pins.map((pin) => (
            <div
                key={pin.id}
                title={pin.description}
                style={{
                position: "absolute",
                left: `${pin.x * imgRef.current.width}px`,
                top: `${pin.y * imgRef.current.height}px`,
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: getColor(pin.category),
                transform: "translate(-50%, -50%)",
                border: "1px solid black",
                }}
            />
        ))}

        {/* New Pin Popup */}
        {newPinCoords && (
        <div
            style={{
            position: "absolute",
            left: `${newPinCoords.x * imgRef.current.width}px`,
            top: `${newPinCoords.y * imgRef.current.height}px`,
            transform: "translate(-50%, -50%)",
            background: "white",
            border: "1px solid black",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 100,
            }}
        >
            <input
            placeholder="Description"
            value={newPinDesc}
            onChange={(e) => setNewPinDesc(e.target.value)}
            />
            <select
            value={newPinCategory}
            onChange={(e) => setNewPinCategory(e.target.value)}
            >
            <option>Lore</option>
            <option>Quest</option>
            <option>Raid</option>
            <option>Dungeon</option>
            </select>
            <button onClick={handleSavePin}>Save</button>
            <button onClick={handleCancelPin}>Cancel</button>
        </div>
        )}
      </div>
    </div>
  );
}

export default CustomMap;
