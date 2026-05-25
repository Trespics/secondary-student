import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, User, Bell, LogOut, Home, BarChart3, X } from "lucide-react";
import "./styles/PortalLayout.css";

interface Props { isOpen?: boolean; onClose?: () => void; }

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/student" },
  { label: "My Profile", icon: User, to: "/student/profile" },
  { label: "Notifications", icon: Bell, to: "/student/notifications" },
  { label: "Grades & Results", icon: BarChart3, to: "/student/grades" },
];

const StudentPortalSidebar = ({ isOpen, onClose }: Props) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => { onClose?.(); };
  const handleLogout = () => { logout(); window.location.href = "/"; };

  return (
    <>
      <aside className={`portal-sidebar student ${isMobile ? "mobile" : ""} ${isOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Home className="header-icon" />
            <span className="header-title">{user?.schools?.name || "School Portal"}</span>
          </div>
          {isMobile && (
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#a0a3bd", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px" }} aria-label="Close menu">
              <X size={24} />
            </button>
          )}
        </div>
        <div style={{ padding: "12px 16px" }}>
          <Link to="/masomo" onClick={handleLinkClick} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            padding: "10px", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            borderRadius: "8px", color: "white", textDecoration: "none", fontSize: "0.9rem",
            fontWeight: 600, boxShadow: "0 4px 12px rgba(139,92,246,0.3)"
          }}>📚 Go to Masomo</Link>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(link => {
            const isActive = pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className={`nav-link ${isActive ? "active" : ""}`} onClick={handleLinkClick}>
                <link.icon className="nav-icon" /><span className="nav-label">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="logout-button">
          <LogOut className="logout-icon" /><span className="logout-label">Logout</span>
        </button>
      </aside>
    </>
  );
};

export default StudentPortalSidebar;
