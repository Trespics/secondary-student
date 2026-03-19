import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e1b4b)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
    <div>
      <h1 style={{ fontSize: "6rem", fontWeight: 800, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0" }}>404</h1>
      <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "2rem" }}>Page not found</p>
      <Link to="/" style={{ textDecoration: "none", padding: "0.75rem 2rem", background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white", borderRadius: "12px", fontWeight: 600 }}>Go Home</Link>
    </div>
  </div>
);

export default NotFound;
