import React from "react";

function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://wow.zamimg.com/uploads/screenshots/normal/1059910.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "4em", textShadow: "2px 2px 8px #000" }}>
        World of Warcraft Classic Plus
      </h1>

      {/* Embedded YouTube video */}
      <div style={{
        position: "relative",
        width: "80%",
        maxWidth: "800px",
        paddingBottom: "45%", // 16:9 aspect ratio
        margin: "30px 0"
      }}>
        <iframe
          title="WoW Classic Plus Video"
          src="https://www.youtube.com/embed/MVUD2BqPpEc" // replace with your video URL
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "50%",
            // border: "none",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <p style={{ fontSize: "1.5em", maxWidth: "600px", textShadow: "1px 1px 4px #000" }}>
        Welcome to the ultimate Classic Plus experience! Explore the world, relive the nostalgia, and join our community.
      </p>
      <p style={{ marginTop: "20px", fontSize: "1.2em" }}>
        Coming soon: an exclusive survey to shape the future of Classic Plus!
      </p>
    </div>
  );
}

export default LandingPage;
