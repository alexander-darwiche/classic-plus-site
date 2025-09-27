import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "center",
      padding: "20px",
      backgroundColor: "rgba(0,0,0,0.7)"
    }}>
      <Link to="/" style={{ color: "#fff", margin: "0 20px", textDecoration: "none", fontWeight: "bold" }}>
        Home
      </Link>
      <Link to="/survey" style={{ color: "#fff", margin: "0 20px", textDecoration: "none", fontWeight: "bold" }}>
        Survey
      </Link>
    </nav>
  );
}

export default Navbar;
