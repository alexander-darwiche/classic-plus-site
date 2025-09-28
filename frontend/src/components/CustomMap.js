import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function CustomMap({ backendUrl }) {
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    setMapUrl(`${backendUrl}/map`);
  }, [backendUrl]);

  if (!mapUrl) return <p>Loading map...</p>;

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        wheel={{ step: 0.1 }}
      >
        <TransformComponent>
          <img
            src={mapUrl}
            alt="Custom Map"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default CustomMap;
