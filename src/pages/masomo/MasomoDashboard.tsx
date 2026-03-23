import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { 
  BookOpen, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  ArrowRight, 
  Clock,
  GraduationCap,
  Calendar,
  TrendingUp,
  Award,
  Download,
  ChevronRight,
  BookMarked,
  FileSpreadsheet,
  Presentation
} from "lucide-react";
import "../styles/MasomoDashboard.css";

const MasomoDashboard = () => {
  useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, assignRes, matRes] = await Promise.all([
          api.get("/student/subjects"),
          api.get("/student/assignments"),
          api.get("/student/materials"),
        ]);
        setSubjects(subRes.data || []);
        setAssignments(assignRes.data?.slice(0, 4) || []);
        setMaterials(matRes.data?.slice(0, 4) || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="dashboard-loading">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your dashboard...</p>
          </div>
        </div>
      </MasomoPortalLayout>
    );
  }

  const stats = [
    { 
      title: "Active Subjects", 
      value: subjects.length, 
      icon: BookOpen, 
      colorClass: "stat-purple",
      description: "Current semester"
    },
    { 
      title: "Study Materials",     
      value: materials.length, 
      icon: FileText, 
      colorClass: "stat-blue",
      description: "Available resources"
    },
    { 
      title: "Assignments", 
      value: assignments.length, 
      icon: ClipboardCheck, 
      colorClass: "stat-orange",
      description: "Pending tasks"
    },
    { 
      title: "Performance", 
      value: "A-", 
      icon: TrendingUp, 
      colorClass: "stat-green",
      description: "Average grade"
    },
  ];

  const getMaterialIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'pdf': return <FileText className="icon-small" />;
      case 'video': return <Presentation className="icon-small" />;
      case 'document': return <FileSpreadsheet className="icon-small" />;
      default: return <BookMarked className="icon-small" />;
    }
  };   

  return (
    <MasomoPortalLayout>
      <div className="dashboard-container">
        <div className="dashboard-content">   
          {/* Header Section */}
          <div className="dashboard-header">
            <div className="header-left">
              <div className="header-title-wrapper">
                <div className="header-icon">
                  <GraduationCap className="icon-large" />
                </div>
                <h1 className="header-title">Academic Dashboard</h1>
              </div>
              <p className="header-subtitle">
                Track your progress, access materials, and manage assignments
              </p>
            </div>
            <div className="header-date">
              <Calendar className="icon-medium" />
              <span>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.colorClass}`}>
                <div className="stat-header">
                  <div className="stat-icon-wrapper">
                    <stat.icon className="icon-medium" />
                  </div>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div className="stat-footer">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-description">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h2 className="section-title">
              <Award className="icon-medium" />
              Quick Actions
            </h2>
            <div className="quick-actions-grid">
              {[
                { label: "Browse Materials", icon: FileText, color: "blue", link: "/masomo/materials" },
                { label: "View Assignments", icon: ClipboardCheck, color: "orange", link: "/masomo/assignments" },
                { label: "My Subjects", icon: BookOpen, color: "purple", link: "/masomo/subjects" },
                { label: "Performance", icon: BarChart3, color: "green", link: "/masomo/performance" },
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`action-card action-${action.color}`}
                >
                  <div className="action-icon-wrapper">
                    <action.icon className="icon-medium" />
                  </div>
                  <span className="action-label">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Upcoming Assignments */}
            <div className="content-card">
              <div className="card-header assignments-header">
                <div className="card-header-left">
                  <div className="card-header-icon">
                    <ClipboardCheck className="icon-medium" />
                  </div>
                  <h2 className="card-header-title">Upcoming Assignments</h2>
                </div>
                <Link to="/masomo/assignments" className="card-header-link">
                  View All <ChevronRight className="icon-small" />
                </Link>
              </div>
              
              <div className="card-body">
                {assignments.length === 0 ? (
                  <div className="empty-state">
                    <ClipboardCheck className="empty-icon" />
                    <p className="empty-text">No assignments yet</p>
                  </div>
                ) : (
                  <div className="assignments-list">
                    {assignments.map((assignment: any) => (
                      <div key={assignment.id} className="assignment-item">
                        <div className="assignment-content">
                          <div className="assignment-title-wrapper">
                            <div className="assignment-indicator"></div>
                            <h3 className="assignment-title">{assignment.title}</h3>
                          </div>
                          <p className="assignment-meta">
                            {assignment.subjects?.name} • {assignment.classes?.name}
                          </p>
                          {assignment.due_date && (
                            <div className="assignment-due">
                              <Clock className="icon-small" />
                              <span>
                                Due {new Date(assignment.due_date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                        <button className="assignment-arrow">
                          <ArrowRight className="icon-small" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Materials */}
            <div className="content-card">
              <div className="card-header materials-header">
                <div className="card-header-left">
                  <div className="card-header-icon">
                    <FileText className="icon-medium" />
                  </div>
                  <h2 className="card-header-title">Recent Materials</h2>
                </div>
                <Link to="/masomo/materials" className="card-header-link">
                  View All <ChevronRight className="icon-small" />
                </Link>
              </div>

              <div className="card-body">
                {materials.length === 0 ? (
                  <div className="empty-state">
                    <FileText className="empty-icon" />
                    <p className="empty-text">No materials available</p>
                  </div>
                ) : (
                  <div className="materials-list">
                    {materials.map((material: any) => (
                      <div key={material.id} className="material-item">
                        <div className="material-content">
                          <div className="material-title-wrapper">
                            <div className={`material-icon-wrapper material-${material.type?.toLowerCase() || 'default'}`}>
                              {getMaterialIcon(material.type)}
                            </div>
                            <h3 className="material-title">{material.title}</h3>
                          </div>
                          <p className="material-subject">{material.subjects?.name}</p>
                        </div>
                        <div className="material-actions">
                          <span className={`material-type material-type-${material.type?.toLowerCase() || 'default'}`}>
                            {material.type}
                          </span>
                          <button className="material-download">
                            <Download className="icon-small" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Progress Summary */}
          <div className="progress-section">
            <div className="progress-content">
              <div className="progress-left">
                <div className="progress-icon-wrapper">
                  <TrendingUp className="icon-large" />
                </div>
                <div className="progress-text">
                  <h3 className="progress-title">Weekly Progress</h3>
                  <p className="progress-description">You're doing great! Keep up the momentum.</p>
                </div>
              </div>
              <div className="progress-right">
                <div className="progress-percentage">85%</div>
                <p className="progress-rate">Completion rate</p>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

export default MasomoDashboard;