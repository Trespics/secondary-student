import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const PublicNav = () => {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Library", to: "/https://secondary-library.vercel.app/login" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 4px 30px rgba(0,0,0,0.2)"
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "0 1.5rem", height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontSize: "1.5rem", fontWeight: 800, letterSpacing: "1px",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>FloranteHub</span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="desktop-nav-links">
          {links.map(link => (
            <Link key={link.to} to={link.to} style={{
              textDecoration: "none", fontSize: "0.95rem", fontWeight: 500,
              color: pathname === link.to ? "#ffffff" : "#94a3b8",
              transition: "color 0.3s"
            }}>{link.label}</Link>
          ))}
          <Link to="/login" style={{
            textDecoration: "none", padding: "0.6rem 1.2rem",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#60a5fa", borderRadius: "10px", fontSize: "0.9rem",
            fontWeight: 600, transition: "background 0.2s"
          }}>Student Portal</Link>
          <Link to="/masomo/login" style={{
            textDecoration: "none", padding: "0.6rem 1.2rem",
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            color: "white", borderRadius: "10px", fontSize: "0.9rem",
            fontWeight: 600, boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}>Masomo</Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          display: "none", background: "none", border: "none",
          color: "#e2e8f0", cursor: "pointer", padding: "0.5rem"
        }} className="mobile-nav-toggle">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "absolute", top: "72px", left: 0, right: 0,
          background: "rgba(15, 23, 42, 0.98)", backdropFilter: "blur(20px)",
          padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          {links.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
              textDecoration: "none", padding: "0.75rem 1rem", borderRadius: "10px",
              color: pathname === link.to ? "#ffffff" : "#94a3b8",
              background: pathname === link.to ? "rgba(59,130,246,0.15)" : "transparent",
              fontWeight: 500, fontSize: "0.95rem"
            }}>{link.label}</Link>
          ))}
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{
            textDecoration: "none", padding: "0.75rem 1.5rem", textAlign: "center",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            color: "#60a5fa", borderRadius: "12px", fontWeight: 600, fontSize: "0.9rem",
            marginTop: "0.5rem"
          }}>Student Portal</Link>
          <Link to="/masomo/login" onClick={() => setMobileOpen(false)} style={{
            textDecoration: "none", padding: "0.75rem 1.5rem", textAlign: "center",
            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
            color: "white", borderRadius: "12px", fontWeight: 600, fontSize: "0.9rem",
            marginTop: "0.5rem"
          }}>Masomo Portal</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default PublicNav;
