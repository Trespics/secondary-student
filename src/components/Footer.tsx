import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: "#0f172a", color: "#94a3b8",
      borderTop: "1px solid rgba(255,255,255,0.06)"
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "3rem 1.5rem 1.5rem"
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem", marginBottom: "2rem"
        }}>
          <div>
            <h3 style={{
              fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>TRESPICS</h3>
            <p style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
              Empowering learners with modern CBC-aligned education technology.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.95rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem", transition: "color 0.3s" }}>Home</Link>
              <Link to="/about" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>About Us</Link>
              <Link to="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Contact</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.95rem" }}>Portals</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link to="/login?redirect=/student" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Student Portal</Link>
              <Link to="/login?redirect=/masomo" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Masomo Portal</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: "#e2e8f0", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.95rem" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <span>📧 info@trespics.com</span>
              <span>📞 +254 700 000 000</span>
              <span>📍 Nairobi, Kenya</span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1.25rem", textAlign: "center", fontSize: "0.8rem"
        }}>
          &copy; {currentYear} TRESPICS School. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
