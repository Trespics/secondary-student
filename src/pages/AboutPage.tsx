import { motion } from "framer-motion";
import PublicNav from "@/components/PublicNav";
import Footer from "@/components/Footer";
import { Heart, Target, Eye, Users, BookOpen, Award } from "lucide-react";

const AboutPage = () => {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#e2e8f0" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{
        paddingTop: "120px", paddingBottom: "60px",
        background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)",
        position: "relative"
      }}>
        <div style={{
          position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.1), transparent 70%)",
          top: "-150px", left: "-100px", pointerEvents: "none"
        }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem", textAlign: "center", position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
              background: "linear-gradient(135deg, #f8fafc, #cbd5e1)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "1rem"
            }}>About Florante School</h1>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: "600px", margin: "0 auto" }}>
              We are a forward-thinking institution dedicated to nurturing the next generation of leaders
              through competency-based education and modern learning technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section style={{ padding: "60px 1.5rem", background: "#0f172a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {[
              {
                icon: Target, title: "Our Mission", color: "#3b82f6",
                text: "To provide accessible, quality CBC-aligned education that empowers students to develop critical thinking, creativity, and real-world problem-solving skills."
              },
              {
                icon: Eye, title: "Our Vision", color: "#8b5cf6",
                text: "To be the leading eLearning platform in Kenya, transforming how students learn, interact, and grow in the digital age."
              },
              {
                icon: Heart, title: "Our Values", color: "#ec4899",
                text: "Excellence, integrity, innovation, inclusivity, and a commitment to holistic education that develops the whole learner."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: `linear-gradient(135deg, ${item.color}10, ${item.color}05)`,
                  border: `1px solid ${item.color}25`,
                  borderRadius: "20px", padding: "2.5rem"
                }}
              >
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.5rem", boxShadow: `0 8px 20px ${item.color}30`
                }}>
                  <item.icon size={26} color="white" />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.75rem" }}>{item.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "60px 1.5rem", background: "linear-gradient(180deg, #0f172a, #1a1f3a)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
            {[
              { icon: Users, value: "500+", label: "Students", color: "#3b82f6" },
              { icon: BookOpen, value: "50+", label: "Subjects", color: "#8b5cf6" },
              { icon: Award, value: "25+", label: "Teachers", color: "#f59e0b" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  background: "rgba(30,41,59,0.5)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px", padding: "2rem"
                }}
              >
                <stat.icon size={28} style={{ color: stat.color, marginBottom: "0.75rem" }} />
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f1f5f9" }}>{stat.value}</div>
                <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
