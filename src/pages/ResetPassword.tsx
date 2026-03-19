import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { GraduationCap, Lock, Eye, EyeOff, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setIsLoading(true);
    try { await api.post("/auth/reset-password", { token, newPassword }); setIsSuccess(true); }
    catch (err: any) { setError(err.response?.data?.error || "Failed to reset password."); }
    finally { setIsLoading(false); }
  };

  const boxStyle = { width: "100%", maxWidth: "420px", background: "rgba(30,41,59,0.95)", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" };
  const inputStyle = { width: "100%", padding: "0.875rem 3rem", background: "#1e293b", border: "2px solid #334155", borderRadius: "14px", fontSize: "0.95rem", color: "#e2e8f0", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const };
  const btnStyle = { width: "100%", padding: "0.9rem", background: isLoading ? "#475569" : "linear-gradient(135deg,#3b82f6,#6366f1)", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: 600 as const, cursor: isLoading ? "not-allowed" as const : "pointer" as const, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: "0.5rem" };

  const wrap = { minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)", display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const, padding: "1.5rem" };

  if (!token) {
    return (
      <div style={wrap}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ ...boxStyle, textAlign: "center" as const }}>
          <AlertTriangle size={64} color="#ef4444" style={{ margin: "0 auto 1.5rem" }} />
          <h2 style={{ color: "#f1f5f9", marginBottom: "1rem" }}>Invalid Link</h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>This password reset link is invalid or has expired.</p>
          <button onClick={() => navigate("/forgot-password")} style={btnStyle}>Request New Link</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={boxStyle}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "64px", height: "64px", margin: "0 auto 1.25rem", background: "linear-gradient(135deg,#3b82f6,#6366f1)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={32} color="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.5rem" }}>{isSuccess ? "Password Reset!" : "Set New Password"}</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{isSuccess ? "You can now login with your new password." : "Enter your new password below."}</p>
        </div>
        {isSuccess ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <CheckCircle size={64} color="#10b981" />
            <button onClick={() => navigate("/login")} style={btnStyle}>Go to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "0.5rem" }}>New Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input type={showPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 6 characters" style={inputStyle} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex" }}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "0.5rem" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" style={inputStyle} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", display: "flex" }}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            {error && <div style={{ padding: "0.875rem 1rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: "12px", fontSize: "0.85rem", border: "1px solid rgba(239,68,68,0.2)" }}>⚠️ {error}</div>}
            <button type="submit" disabled={isLoading} style={btnStyle}>
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Resetting...</> : "Reset Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
