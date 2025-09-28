import React, { useEffect, useState, useRef } from "react";

function CustomMap({ backendUrl }) {
  const [pins, setPins] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  // Fetch pins from backend
  useEffect(() => {
    fetch(`${backendUrl}/pins/`)
      .then(res => res.json())
      .then(data => setPins(data));
  }, [backendUrl]);

  // Zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.2), 3));
  };

  // Drag / Pan handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: offsetStart.current.x + dx, y: offsetStart.current.y + dy });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Convert mouse click to map coordinates
  const handleMapClick = async (e) => {
    const rect = mapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / (rect.width * zoom);
    const y = (e.clientY - rect.top - offset.y) / (rect.height * zoom);

    const description = prompt("Enter a description for this pin:");
    if (!description) return;

    const category = prompt("Enter category (Lore, Quest, Raid, Dungeon):", "Lore");
    if (!category) return;

    const newPin = { x, y, description, category };

    const res = await fetch(`${backendUrl}/pins/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPin),
    });
    const savedPin = await res.json();
    setPins([...pins, savedPin]);
  };

  // Pin color by category
  const getColor = (category) => {
    switch (category) {
      case "Lore": return "blue";
      case "Quest": return "green";
      case "Raid": return "red";
      case "Dungeon": return "purple";
      default: return "gray";
    }
  };

  return (
    <div
      style={{
        width: "80%",
        margin: "auto",
        height: "80vh",
        overflow: "hidden",
        border: "2px solid black",
        position: "relative",
        cursor: isDragging.current ? "grabbing" : "grab"
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={mapRef}
      onClick={(e) => {
        if (!isDragging.current) handleMapClick(e);
      }}
    >
      <img
        src="/map.jpg"
        alt="Map"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "top left",
          width: "100%",
          height: "100%",
          display: "block",
          userSelect: "none",
          pointerEvents: "none", // allow clicks to go to container
        }}
        draggable={false}
      />

      {pins.map((pin) => (
        <div
          key={pin.id}
          title={`${pin.category}: ${pin.description}`}
          style={{
            position: "absolute",
            top: `${pin.y * 100}%`,
            left: `${pin.x * 100}%`,
            transform: `translate(-50%, -50%) scale(${zoom})`,
            width: "15px",
            height: "15px",
            backgroundColor: getColor(pin.category),
            borderRadius: "50%",
            border: "1px solid black",
            cursor: "pointer",
            pointerEvents: "auto", // make pins clickable/hoverable
          }}
        />
      ))}
    </div>
  );
}

export default CustomMap;
