import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import { BookOpen, User, GraduationCap, Shield, ArrowRight, Star, Zap, Globe } from "lucide-react";

const HomePage = () => {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" }}>
      <PublicNav />

      {/* Hero Section */}
      <section style={{
        paddingTop: "120px", paddingBottom: "80px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Animated gradient orbs */}
        <div style={{
          position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)",
          top: "-200px", right: "-100px", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
          bottom: "-100px", left: "-50px", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.2)", borderRadius: "2rem",
              fontSize: "0.85rem", color: "#60a5fa", marginBottom: "1.5rem"
            }}>
              <Star size={14} /> CBC-Aligned eLearning Platform
            </div>

            <h1 style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 800,
              lineHeight: 1.1, marginBottom: "1.5rem",
              background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Your Learning Journey Starts Here<br />
              {/* <span style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Starts Here</span> */}
            </h1>

            <p style={{
              fontSize: "1.15rem", color: "#94a3b8", maxWidth: "600px",
              margin: "0 auto 2.5rem", lineHeight: 1.7
            }}>
              Access your courses, materials, assignments, and track your academic progress — all in one place.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/login" style={{
                textDecoration: "none", padding: "0.9rem 2rem",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white", borderRadius: "14px", fontSize: "1rem",
                fontWeight: 600, boxShadow: "0 8px 25px rgba(59,130,246,0.35)",
                display: "flex", alignItems: "center", gap: "0.5rem",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}>
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/about" style={{
                textDecoration: "none", padding: "0.9rem 2rem",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0", borderRadius: "14px", fontSize: "1rem", fontWeight: 500,
                transition: "background 0.3s"
              }}>
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portals Section */}
      <section style={{
        padding: "80px 1.5rem",
        background: "linear-gradient(180deg, #0f172a, #1a1f3a)"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h2 style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700,
              color: "#f1f5f9", marginBottom: "0.75rem"
            }}>Two Portals, One Experience</h2>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto" }}>
              Your academic life organized into two focused portals
            </p>
          </motion.div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem"
          }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
            >     
              <Link to="/login" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.02))",
                  border: "1px solid rgba(59,130,246,0.15)", borderRadius: "24px",
                  padding: "2.5rem", height: "100%", transition: "all 0.3s"
                }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.5rem", boxShadow: "0 8px 20px rgba(59,130,246,0.3)"
                  }}>
                    <User size={28} color="white" />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.75rem" }}>
                    Student Portal
                  </h3>
                  <p style={{ color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                    Manage your profile, view notifications, and keep track of your personal details and enrollment status.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {["Dashboard & Overview", "Profile Management", "Notifications"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#60a5fa", fontSize: "0.9rem" }}>
                        <Shield size={14} /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to="/masomo/login" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))",
                  border: "1px solid rgba(139,92,246,0.15)", borderRadius: "24px",
                  padding: "2.5rem", height: "100%", transition: "all 0.3s"
                }}>
                  <div style={{
                    width: "56px", height: "56px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.5rem", boxShadow: "0 8px 20px rgba(139,92,246,0.3)"
                  }}>
                    <BookOpen size={28} color="white" />
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.75rem" }}>
                    Masomo Portal
                  </h3>
                  <p style={{ color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                    Access learning materials, complete assignments, take CATs, and track your academic grades and performance.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {["Subjects & Materials", "Assignments & CATs", "Grades & Results"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#a78bfa", fontSize: "0.9rem" }}>
                        <GraduationCap size={14} /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 1.5rem", background: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.75rem" }}>
              Everything You Need to Succeed
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.05rem" }}>
              Powerful features designed for the modern student
            </p>
          </motion.div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem"
          }}>
            {[
              { icon: BookOpen, title: "Learning Materials", desc: "Access notes, videos, past papers and more for all your subjects", color: "#3b82f6" },
              { icon: GraduationCap, title: "Assignments", desc: "View, submit and track your assignments with ease", color: "#8b5cf6" },
              { icon: Zap, title: "CATs & Exams", desc: "Take online assessments and view your results instantly", color: "#f59e0b" },
              { icon: Globe, title: "CBC Aligned", desc: "Content structured around the CBC curriculum framework", color: "#10b981" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px", padding: "2rem", transition: "transform 0.3s, border-color 0.3s"
                }}
              >
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: `${feat.color}20`, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "1rem", color: feat.color
                }}>
                  <feat.icon size={22} />
                </div>
                <h3 style={{ color: "#f1f5f9", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                  {feat.title}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 1.5rem",
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)"
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{
            maxWidth: "700px", margin: "0 auto", textAlign: "center",
            background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
            border: "1px solid rgba(99,102,241,0.2)", borderRadius: "24px", padding: "3rem 2rem"
          }}
        >
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem" }}>
            Ready to Start Learning?
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "2rem", fontSize: "1.05rem" }}>
            Login to your student portal and access all your learning resources.
          </p>
          <Link to="/student" style={{
            textDecoration: "none", padding: "0.9rem 2.5rem",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white", borderRadius: "14px", fontSize: "1rem",
            fontWeight: 600, boxShadow: "0 8px 25px rgba(59,130,246,0.35)",
            display: "inline-flex", alignItems: "center", gap: "0.5rem"
          }}>
            Login to Portal <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
