import { type ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import StudentPortalSidebar from "./StudentPortalSidebar";
import { Menu, X } from "lucide-react";
import "./styles/PortalLayout.css";

interface Props { children: ReactNode; }

const StudentPortalLayout = ({ children }: Props) => {
  const { isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="portal-layout student">
      {isMobile && <div className={`mobile-overlay ${isSidebarOpen ? "visible" : ""}`} onClick={() => setIsSidebarOpen(false)} />}
      <StudentPortalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={`portal-main ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <header className="mobile-header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle menu">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="mobile-logo">TRESPICS</span>
          <div className="header-avatar"><span className="avatar-initials">{user?.name?.charAt(0) || "S"}</span></div>
        </header>
        <header className="desktop-header">
          <div className="header-left">
            <h1 className="page-title">Welcome back, {user?.name || "Student"}</h1>
            <p className="page-subtitle">Track your academic progress</p>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <span className="user-name">{user?.name || "Student"}</span>
              <div className="user-avatar"><span className="avatar-initials">{user?.name?.charAt(0) || "S"}</span></div>
            </div>
          </div>
        </header>
        <div className="content-wrapper"><div className="content-container">{children}</div></div>
      </main>
    </div>
  );
};

export default StudentPortalLayout;
