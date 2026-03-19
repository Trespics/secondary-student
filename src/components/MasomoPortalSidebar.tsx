import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, BookOpen, FileText, ClipboardCheck, BarChart3, LogOut, Home, Menu, X } from "lucide-react";
import "./styles/PortalLayout.css";

interface Props { isOpen?: boolean; onClose?: () => void; }

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/masomo" },
  { label: "Subjects", icon: BookOpen, to: "/masomo/subjects" },
  { label: "Books", icon: BookOpen, to: "/masomo/books" },
  { label: "Pastpapers", icon: FileText, to: "/masomo/past-papers" },
  { label: "Assignments", icon: ClipboardCheck, to: "/masomo/assignments" },
  { label: "Grades & Results", icon: BarChart3, to: "/masomo/grades" },
  { label: "CATs", icon: ClipboardCheck, to: "/masomo/cats" },
];

const MasomoPortalSidebar = ({ onClose }: Props) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => { setIsMobileMenuOpen(false); onClose?.(); };
  const handleLogout = () => { logout(); window.location.href = "/"; };

  return (
    <>
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); if (!isMobileMenuOpen) onClose?.(); }} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      {isMobile && isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />}
      <aside className={`portal-sidebar masomo ${isMobile ? "mobile" : ""} ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header"><Home className="header-icon" /><span className="header-title">TRESPICS</span></div>
        <div style={{ padding: "12px 16px" }}>
          <Link to="/student" onClick={handleLinkClick} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            padding: "10px", background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            borderRadius: "8px", color: "white", textDecoration: "none", fontSize: "0.9rem",
            fontWeight: 600, boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
          }}>👤 Go to Student Portal</Link>
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

export default MasomoPortalSidebar;
