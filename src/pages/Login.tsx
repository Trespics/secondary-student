import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get("redirect") || "/student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(redirectParams);
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%", maxWidth: "420px",
          background: "rgba(30, 41, 59, 0.95)", backdropFilter: "blur(10px)",
          borderRadius: "24px", padding: "2.5rem",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "64px", height: "64px", margin: "0 auto 1.25rem",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 25px rgba(59,130,246,0.3)"
          }}>
            <GraduationCap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>Student Portal</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Sign in to access your portal</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "0.5rem" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@school.com"
                style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 3rem", background: "#1e293b", border: "2px solid #334155", borderRadius: "14px", fontSize: "0.95rem", color: "#e2e8f0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                style={{ width: "100%", padding: "0.875rem 3rem 0.875rem 3rem", background: "#1e293b", border: "2px solid #334155", borderRadius: "14px", fontSize: "0.95rem", color: "#e2e8f0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "0.25rem", display: "flex" }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: "0.875rem 1rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: "12px", fontSize: "0.85rem", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <button type="submit" disabled={isLoading}
            style={{ width: "100%", padding: "0.9rem", background: isLoading ? "#475569" : "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 600, cursor: isLoading ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.3)", marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            {isLoading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In"}
          </button>

          <button type="button" onClick={() => navigate("/forgot-password")}
            style={{ width: "100%", padding: "0.75rem", background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: "14px", fontSize: "0.9rem", cursor: "pointer", fontWeight: 500, transition: "background 0.3s" }}>
            Forgot Password?
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/" style={{ color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentLogin;
