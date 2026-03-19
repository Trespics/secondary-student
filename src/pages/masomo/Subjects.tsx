import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { BookOpen, Loader2, User } from "lucide-react";
import "../styles/Subjects.css";

const Subjects = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchSubjects = async () => {
      try { 
        const { data } = await api.get("/student/subjects"); 
        setSubjects(data || []); 
      }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSubjects();
  }, []);

  const classes = ["All", ...new Set(subjects.map((s: any) => s.classes?.name).filter(Boolean))];
  const filteredSubjects = activeTab === "All" 
    ? subjects 
    : subjects.filter((s: any) => s.classes?.name === activeTab);

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="subjects-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </MasomoPortalLayout>
    );
  }

  return (
    <MasomoPortalLayout>
      <div className="subjects-container">
        <div className="subjects-content">
          {/* Header Section */}
          <div className="subjects-header">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <BookOpen className="header-icon" />
              </div>
              <div>
                <h1 className="header-title">My Subjects</h1>
                <p className="header-subtitle">
                  Subjects you are enrolled in based on your class
                </p>
              </div>
            </div>
            
            {/* Stats Badge */}
            <div className="header-stats">
              <span className="stats-badge">
                <span className="stats-count">{subjects.length}</span>
                <span className="stats-label">Total Subjects</span>
              </span>
            </div>
          </div>

          {/* Subject Tabs */}
          {subjects.length > 0 && classes.length > 2 && (
            <div className="subjects-tabs">
              {classes.map((className: any) => (
                <button
                  key={className}
                  className={`subject-tab ${activeTab === className ? 'active' : ''}`}
                  onClick={() => setActiveTab(className)}
                >
                  {className}
                </button>
              ))}
            </div>
          )}

          {/* Subjects Grid */}
          {subjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <BookOpen className="empty-icon" />
              </div>
              <h3 className="empty-title">No subjects found</h3>
              <p className="empty-description">
                You may not be enrolled in a class yet. Please contact your administrator.
              </p>
              <Link to="/masomo" className="empty-action">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Subject Count Info */}
              <div className="subjects-info">
                <p className="info-text">
                  Showing <span className="info-highlight">{filteredSubjects.length}</span> subject{filteredSubjects.length !== 1 ? 's' : ''} {activeTab !== "All" ? `for ${activeTab}` : 'for the current semester'}
                </p>
              </div>

              {/* Subjects Grid */}
              <div className="subjects-grid">
                {filteredSubjects.map((subject: any, index: number) => (
                  <SubjectCard key={subject.id || index} subject={subject} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

// Subject Card Component
const SubjectCard = ({ subject, index }: { subject: any; index: number }) => {
  // Generate a consistent color based on subject name
  const getSubjectColor = (name: string = '') => {
    const colors = [
      { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6', light: '#eff6ff' },
      { bg: '#e0f2fe', text: '#0369a1', border: '#0ea5e9', light: '#f0f9ff' },
      { bg: '#cffafe', text: '#0891b2', border: '#06b6d4', light: '#ecfeff' },
      { bg: '#e0e7ff', text: '#3730a3', border: '#6366f1', light: '#eef2ff' },
      { bg: '#ede9fe', text: '#5b21b6', border: '#8b5cf6', light: '#f5f3ff' },
    ];
    
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) {
      hash = ((hash << 5) - hash) + name.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const subjectName = subject.subjects?.name || "Subject";
  const subjectCode = subject.subjects?.code || subjectName.substring(0, 2).toUpperCase();
  const colors = getSubjectColor(subjectName);
  
  return (
    <div 
      className="subject-card-wrapper"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <Link to={`/masomo/subjects/${subject.subject_id}`} className="subject-card-link">
        <div className="subject-card" style={{ borderLeftColor: colors.border }}>
          <div className="subject-card-header">
            <div className="subject-icon" style={{ background: colors.bg, color: colors.text }}>
              {subjectCode}
            </div>
            <div className="subject-info">
              <h3 className="subject-name">{subjectName}</h3>
              <p className="subject-class">{subject.classes?.name || "Class not assigned"}</p>
            </div>
          </div>
          
          <div className="subject-card-body">
            <div className="subject-teacher">
              <User className="teacher-icon" style={{ color: colors.border }} />
              <span className="teacher-name">
                Teacher: {subject.users?.name || "To be assigned"}
              </span>
            </div>
            
            {/* Progress Indicator */}
            <div className="subject-progress">
              <div className="progress-label">
                <span>Progress</span>
                <span style={{ color: colors.border }}>65%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: '65%', 
                    background: `linear-gradient(90deg, ${colors.border}, ${colors.border}dd)` 
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Hover Effect Overlay */}
          <div className="card-hover-overlay" style={{ background: colors.light }} />
        </div>
      </Link>
    </div>
  );
};

export default Subjects;