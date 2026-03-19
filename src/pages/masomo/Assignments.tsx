import { useState, useEffect } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  ClipboardCheck, Loader2, Clock, CheckCircle, 
  Upload, AlertCircle, FileText, Calendar, 
  User, BookOpen, Download, Eye, Filter,
  ChevronDown, Search
} from "lucide-react";
import "../styles/Assignment.css";

const Assignments = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try { 
        const { data } = await api.get("/student/assignments"); 
        setAssignments(data || []); 
      }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAssignments();
  }, []);

  // Filter assignments based on status and search
  useEffect(() => {
    let filtered = assignments;
    
    // Filter by status
    if (filter !== "all") {
      const now = new Date();
      filtered = filtered.filter(a => {
        if (!a.due_date) return filter === "all";
        
        const dueDate = new Date(a.due_date);
        if (filter === "pending") return dueDate >= now;
        if (filter === "overdue") return dueDate < now;
        if (filter === "submitted") return a.submitted;
        return true;
      });
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title?.toLowerCase().includes(query) ||
        a.subjects?.name?.toLowerCase().includes(query) ||
        a.classes?.name?.toLowerCase().includes(query)
      );
    }
    
    setFilteredAssignments(filtered);
  }, [filter, assignments, searchQuery]);

  const isOverdue = (date: string) => new Date(date) < new Date();

  const getStatusBadge = (assignment: any) => {
    if (assignment.submitted) {
      return { label: "Submitted", class: "status-submitted", icon: CheckCircle };
    }
    if (assignment.due_date) {
      if (isOverdue(assignment.due_date)) {
        return { label: "Overdue", class: "status-overdue", icon: AlertCircle };
      }
      return { label: "Pending", class: "status-pending", icon: Clock };
    }
    return { label: "Pending", class: "status-pending", icon: Clock };
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="assignments-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </MasomoPortalLayout>
    );
  }

  return (
    <MasomoPortalLayout>
      <div className="assignments-container">
        <div className="assignments-content">
          {/* Header Section */}
          <div className="assignments-header">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <ClipboardCheck className="header-icon" />
              </div>
              <div>
                <h1 className="header-title">Assignments</h1>
                <p className="header-subtitle">
                  View and submit your assignments
                </p>
              </div>
            </div>
            
            {/* Stats Badge */}
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-value">{assignments.length}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{assignments.filter(a => a.due_date && !isOverdue(a.due_date) && !a.submitted).length}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{assignments.filter(a => a.due_date && isOverdue(a.due_date) && !a.submitted).length}</span>
                <span className="stat-label">Overdue</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="search-box">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-tab ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`filter-tab ${filter === "overdue" ? "active" : ""}`}
                onClick={() => setFilter("overdue")}
              >
                Overdue
              </button>
              <button
                className={`filter-tab ${filter === "submitted" ? "active" : ""}`}
                onClick={() => setFilter("submitted")}
              >
                Submitted
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <p className="info-text">
              Showing <span className="info-highlight">{filteredAssignments.length}</span> assignments
              {filter !== "all" && ` (${filter})`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Assignments List */}
          {filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <ClipboardCheck className="empty-icon" />
              </div>
              <h3 className="empty-title">No assignments found</h3>
              <p className="empty-description">
                {searchQuery 
                  ? "No assignments match your search criteria. Try different keywords."
                  : filter !== "all"
                  ? `No ${filter} assignments available at the moment.`
                  : "No assignments available for your classes yet."}
              </p>
              {(filter !== "all" || searchQuery) && (
                <button 
                  className="empty-action"
                  onClick={() => {
                    setFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="assignments-list">
              {filteredAssignments.map((assignment, index) => {
                const status = getStatusBadge(assignment);
                const StatusIcon = status.icon;
                const overdue = assignment.due_date && isOverdue(assignment.due_date);
                
                return (
                  <div 
                    key={assignment.id} 
                    className="assignment-item-wrapper"
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className={`assignment-card ${status.class}`}>
                      {/* Status Indicator */}
                      <div className="assignment-status-bar"></div>
                      
                      <div className="assignment-content">
                        {/* Header Section */}
                        <div className="assignment-header">
                          <div className="assignment-title-section">
                            <h3 className="assignment-title">{assignment.title}</h3>
                            {assignment.is_mcq && (
                              <span className="mcq-badge">MCQ</span>
                            )}
                            <span className={`status-badge ${status.class}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="assignment-meta">
                          <div className="meta-item">
                            <BookOpen size={14} />
                            <span>{assignment.subjects?.name || "No subject"}</span>
                          </div>
                          <div className="meta-item">
                            <User size={14} />
                            <span>{assignment.users?.name || "Teacher"}</span>
                          </div>
                          <div className="meta-item">
                            <FileText size={14} />
                            <span>{assignment.classes?.name || "Class"}</span>
                          </div>
                        </div>

                        {/* Instructions */}
                        {assignment.instructions && (
                          <p className="assignment-instructions">
                            {assignment.instructions}
                          </p>
                        )}

                        {/* Due Date and Time Info */}
                        <div className="assignment-due-info">
                          {assignment.due_date && (
                            <div className={`due-date ${overdue ? 'overdue' : ''}`}>
                              <Calendar size={14} />
                              <span>
                                Due: {new Date(assignment.due_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                                {overdue && " (Overdue)"}
                              </span>
                            </div>
                          )}
                          
                          {assignment.time_limit_minutes && (
                            <div className="time-limit">
                              <Clock size={14} />
                              <span>{assignment.time_limit_minutes} minutes</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="assignment-actions">
                          {assignment.file_url && (
                            <>
                              <a 
                                href={assignment.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="action-button view-button"
                              >
                                <Eye size={16} />
                                <span>Preview</span>
                              </a>
                              <a 
                                href={assignment.file_url} 
                                download
                                className="action-button download-button"
                              >
                                <Download size={16} />
                                <span>Download</span>
                              </a>
                            </>
                          )}
                          
                          {!assignment.submitted && !overdue && (
                            <button className="action-button submit-button">
                              <Upload size={16} />
                              <span>Submit</span>
                            </button>
                          )}
                          
                          {assignment.submitted && (
                            <div className="submitted-badge">
                              <CheckCircle size={16} />
                              <span>Submitted</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

export default Assignments;