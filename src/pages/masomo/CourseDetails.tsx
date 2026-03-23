import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  Loader2, ArrowLeft, FileText, Video, ClipboardCheck, 
  File, Download, Eye, Clock, AlertCircle, User, BookOpen
} from "lucide-react";
import "../styles/CourseDetails.css";
    
const CourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<"notes" | "books" | "videos" | "pastpapers" | "assignments">("notes");
  const [subjectInfo, setSubjectInfo] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { 
        setLoading(true);
        // Fetch subject details
        const subRes = await api.get("/student/subjects");
        const subject = subRes.data?.find((s: any) => s.subject_id === courseId);
        setSubjectInfo(subject);

        // Fetch materials with subject_id filter
        const matRes = await api.get(`/student/materials?subject_id=${courseId}`);
        const subjectMaterials = matRes.data || [];
        
        // Fetch past papers specifically from its own endpoint
        const ppRes = await api.get(`/student/past-papers?subject_id=${courseId}`);
        const subjectPastPapers = ppRes.data || [];

        // Combine materials from the materials table with papers from the past_papers table
        // This ensures any "Past Paper" type in materials table is also included
        setMaterials([...subjectMaterials, ...subjectPastPapers.map((p: any) => ({ ...p, type: "Past Paper" }))]);

        // Fetch assignments with subject_id filter
        const assignRes = await api.get(`/student/assignments?subject_id=${courseId}`);
        setAssignments(assignRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  const isOverdue = (date: string) => new Date(date) < new Date();

  const handleViewMaterial = (item: any) => {
    const url = item.file_url || item.content_link;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getTabCount = (tabType: string) => {
    switch(tabType) {
      case "notes": return materials.filter(m => m.type === "Notes").length;
      case "books": return materials.filter(m => m.type === "Book").length;
      case "videos": return materials.filter(m => m.type === "Video" || m.type === "Audio").length;
      case "pastpapers": return materials.filter(m => m.type === "Past Paper").length;
      case "assignments": return assignments.length;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="course-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </MasomoPortalLayout>
    );
  }

  if (!subjectInfo) {
    return (
      <MasomoPortalLayout>
        <div className="not-found-container">
          <div className="not-found-content">
            <div className="not-found-icon">!</div>
            <h3 className="not-found-title">Subject Not Found</h3>
            <p className="not-found-description">
              You may not be enrolled in this subject or it may have been removed.
            </p>
            <Link to="/masomo/subjects" className="not-found-link">
              <ArrowLeft size={16} />
              Back to Subjects
            </Link>
          </div>
        </div>
      </MasomoPortalLayout>
    );
  }

  const MaterialCard = ({ item, icon: Icon }: { item: any, icon: any }) => (
    <div 
      className="material-card-wrapper"
      onClick={() => handleViewMaterial(item)}
    >
      <div className="material-card">
        <div className="material-card-header">
          <div className="material-icon-wrapper">
            <Icon className="material-icon" />
          </div>
          <button className="material-view-button">
            <Eye size={16} />
          </button>
        </div>
        
        <div className="material-card-content">
          <h3 className="material-title">{item.title}</h3>
          <div className="material-meta">
            <Clock size={12} />
            <span>{new Date(item.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>

        <div className="material-card-footer">
          <span className="material-teacher">
            <User size={12} />
            {item.users?.name || "Teacher"}
          </span>
          {item.file_url && (
            <Download size={14} className="material-download-icon" />
          )}
        </div>

        <div className="material-hover-overlay" />
      </div>
    </div>
  );

  const notes = materials.filter(m => m.type === "Notes");
  const books = materials.filter(m => m.type === "Book");
  const videos = materials.filter(m => m.type === "Video" || m.type === "Audio");
  const pastPapers = materials.filter(m => m.type === "Past Paper");

  return (
    <MasomoPortalLayout>
      <div className="course-details-container">
        <div className="course-details-content">
          {/* Back Button */}
          <Link to="/masomo/subjects" className="back-button">
            <div className="back-icon-wrapper">
              <ArrowLeft size={16} />
            </div>
            Back to Subjects
          </Link>

          {/* Course Header */}
          <div className="course-header">
            <div className="header-background"></div>
            <div className="header-content">
              <div className="course-icon-wrapper">
                <span className="course-icon-text">
                  {subjectInfo.subjects?.name?.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="course-info">
                <div className="course-title-section">
                  <h1 className="course-title">{subjectInfo.subjects?.name}</h1>
                  <span className="course-class-badge">
                    {subjectInfo.classes?.name}
                  </span>
                </div>
                <p className="course-teacher">
                  <User size={16} className="teacher-icon" />
                  Facilitator: <span className="teacher-name">{subjectInfo.users?.name || "Not Assigned"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-icon notes-icon">
                <FileText size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{notes.length}</span>
                <span className="stat-label">Notes</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon books-icon">
                <BookOpen size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{books.length}</span>
                <span className="stat-label">Books</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon videos-icon">
                <Video size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{videos.length}</span>
                <span className="stat-label">Videos</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon papers-icon">
                <File size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{pastPapers.length}</span>
                <span className="stat-label">Past Papers</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon assignments-icon">
                <ClipboardCheck size={18} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{assignments.length}</span>
                <span className="stat-label">Assignments</span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-container">
            {[
              { id: "notes", label: "Notes", icon: FileText },
              { id: "books", label: "Books", icon: BookOpen },
              { id: "videos", label: "Videos", icon: Video },
              { id: "pastpapers", label: "Past Papers", icon: File },
              { id: "assignments", label: "Assignments", icon: ClipboardCheck },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
                {getTabCount(tab.id) > 0 && (
                  <span className={`tab-count ${activeTab === tab.id ? 'active' : ''}`}>
                    {getTabCount(tab.id)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Notes Tab */}
            {activeTab === "notes" && (
              <>
                {notes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                      <FileText className="empty-icon" />
                    </div>
                    <h3 className="empty-title">No notes available</h3>
                    <p className="empty-description">
                      Your teacher hasn't uploaded any notes for this subject yet.
                    </p>
                  </div>
                ) : (
                  <div className="materials-grid">
                    {notes.map(note => (
                      <MaterialCard key={note.id} item={note} icon={FileText} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Books Tab */}
            {activeTab === "books" && (
              <>
                {books.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                      <BookOpen className="empty-icon" />
                    </div>
                    <h3 className="empty-title">No books available</h3>
                    <p className="empty-description">
                      There are no recommended books for this subject yet.
                    </p>
                  </div>
                ) : (
                  <div className="materials-grid">
                    {books.map(book => (
                      <MaterialCard key={book.id} item={book} icon={BookOpen} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <>
                {videos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                      <Video className="empty-icon" />
                    </div>
                    <h3 className="empty-title">No videos available</h3>
                    <p className="empty-description">
                      Check back later for educational videos and clips.
                    </p>
                  </div>
                ) : (
                  <div className="materials-grid">
                    {videos.map(video => (
                      <MaterialCard key={video.id} item={video} icon={Video} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Past Papers Tab */}
            {activeTab === "pastpapers" && (
              <>
                {pastPapers.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                      <File className="empty-icon" />
                    </div>
                    <h3 className="empty-title">No past papers</h3>
                    <p className="empty-description">
                      Past exam papers will appear here once uploaded.
                    </p>
                  </div>
                ) : (
                  <div className="materials-grid">
                    {pastPapers.map(paper => (
                      <MaterialCard key={paper.id} item={paper} icon={File} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Assignments Tab */}
            {activeTab === "assignments" && (
              <>
                {assignments.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                      <ClipboardCheck className="empty-icon" />
                    </div>
                    <h3 className="empty-title">No assignments</h3>
                    <p className="empty-description">
                      You're all caught up! No assignments for this subject.
                    </p>
                  </div>
                ) : (
                  <div className="assignments-list">
                    {assignments.map((assignment, index) => {
                      const overdue = assignment.due_date && isOverdue(assignment.due_date);
                      return (
                        <div 
                          key={assignment.id} 
                          className={`assignment-card ${overdue ? 'overdue' : ''}`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="assignment-content">
                            <div className="assignment-header">
                              <h3 className="assignment-title">{assignment.title}</h3>
                              {assignment.is_mcq && (
                                <span className="mcq-badge">Online Quiz</span>
                              )}
                            </div>
                            
                            {assignment.instructions && (
                              <p className="assignment-instructions">
                                {assignment.instructions}
                              </p>
                            )}
                            
                            <div className="assignment-meta">
                              {assignment.due_date && (
                                <span className={`due-badge ${overdue ? 'overdue' : ''}`}>
                                  {overdue ? <AlertCircle size={14} /> : <Clock size={14} />}
                                  Due: {new Date(assignment.due_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                  {overdue && " (OVERDUE)"}
                                </span>
                              )}
                              
                              {assignment.time_limit_minutes && (
                                <span className="time-badge">
                                  <Clock size={14} />
                                  {assignment.time_limit_minutes} minutes
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="assignment-actions">
                            {assignment.file_url ? (
                              <a 
                                href={assignment.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="assignment-button download-button"
                              >
                                <Download size={18} />
                                Download Task
                              </a>
                            ) : (
                              <button className="assignment-button view-button">
                                View Assignment
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

export default CourseDetails;