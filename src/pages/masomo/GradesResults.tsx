import { useState, useEffect } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  BarChart3, Loader2, Award, FileText, 
  TrendingUp, Download, Filter, Calendar,
  ChevronDown, Star, BookOpen, Clock
} from "lucide-react";
import "../styles/GradeResults.css";

const GradesResults = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"grades" | "results">("grades");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "marks">("date");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gRes, rRes] = await Promise.all([
          api.get("/student/grades"), 
          api.get("/student/results")
        ]);
        setGrades(gRes.data || []); 
        setResults(rRes.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getUniqueSubjects = () => {
    const items = tab === "grades" ? grades : results;
    const subjects = items.map(item => item.assignments?.subjects?.name).filter(Boolean);
    return ["all", ...new Set(subjects)];
  };

  const getFilteredData = () => {
    const data = tab === "grades" ? grades : results;
    
    let filtered = [...data];
    
    // Apply subject filter
    if (filterSubject !== "all") {
      filtered = filtered.filter(item => 
        item.assignments?.subjects?.name === filterSubject
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.graded_at || a.created_at || 0).getTime();
        const dateB = new Date(b.graded_at || b.created_at || 0).getTime();
        return dateB - dateA;
      } else {
        const marksA = a.marks_obtained || 0;
        const marksB = b.marks_obtained || 0;
        return marksB - marksA;
      }
    });
    
    return filtered;
  };

  const calculateStats = () => {
    const data = tab === "grades" ? grades : results;
    if (data.length === 0) return null;
    
    const marks = data.map(item => item.marks_obtained || 0).filter(m => m > 0);
    const total = marks.reduce((a, b) => a + b, 0);
    const average = marks.length > 0 ? (total / marks.length).toFixed(1) : 0;
    const highest = marks.length > 0 ? Math.max(...marks) : 0;
    const lowest = marks.length > 0 ? Math.min(...marks) : 0;
    
    return { average, highest, lowest, count: marks.length };
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="grades-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </MasomoPortalLayout>
    );
  }

  const stats = calculateStats();
  const filteredData = getFilteredData();
  const subjects = getUniqueSubjects();

  return (
    <MasomoPortalLayout>
      <div className="grades-container">
        <div className="grades-content">
          {/* Header Section */}
          <div className="grades-header">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <BarChart3 className="header-icon" />
              </div>
              <div>
                <h1 className="header-title">Grades & Results</h1>
                <p className="header-subtitle">
                  View your graded submissions and academic results
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            {stats && (
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <span className="stat-value">{stats.count}</span>
                  <span className="stat-label">Items</span>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-value">{stats.average}</span>
                  <span className="stat-label">Average</span>
                </div>
                <div className="quick-stat-item">
                  <span className="stat-value">{stats.highest}</span>
                  <span className="stat-label">Highest</span>
                </div>
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="tabs-container">
            <button
              onClick={() => setTab("grades")}
              className={`tab-button ${tab === "grades" ? "active" : ""}`}
            >
              <Award size={18} />
              <span>Grades</span>
              {grades.length > 0 && (
                <span className="tab-count">{grades.length}</span>
              )}
            </button>
            <button
              onClick={() => setTab("results")}
              className={`tab-button ${tab === "results" ? "active" : ""}`}
            >
              <FileText size={18} />
              <span>Results</span>
              {results.length > 0 && (
                <span className="tab-count">{results.length}</span>
              )}
            </button>
          </div>

          {/* Filters Section */}
          {filteredData.length > 0 && (
            <div className="filters-section">
              <div className="filter-group">
                <Filter size={16} className="filter-icon" />
                <select 
                  className="filter-select"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <Clock size={16} className="filter-icon" />
                <select 
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="marks">Sort by Marks</option>
                </select>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                {tab === "grades" ? <Award className="empty-icon" /> : <FileText className="empty-icon" />}
              </div>
              <h3 className="empty-title">No {tab} yet</h3>
              <p className="empty-description">
                Your {tab === "grades" ? "graded assignments" : "academic results"} will appear here once available.
                {filterSubject !== "all" && " Try clearing the subject filter."}
              </p>
              {filterSubject !== "all" && (
                <button 
                  className="empty-action"
                  onClick={() => setFilterSubject("all")}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div className="results-summary">
                <p className="summary-text">
                  Showing <span className="summary-highlight">{filteredData.length}</span> of {tab === "grades" ? grades.length : results.length} items
                  {filterSubject !== "all" && ` in ${filterSubject}`}
                </p>
              </div>

              {/* Grades/Results Table */}
              <div className="table-container">
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item: any, index) => {
                      const marksObtained = item.marks_obtained || 0;
                      const totalMarks = item.total_marks || 100;
                      const percentage = totalMarks > 0 ? ((marksObtained / totalMarks) * 100).toFixed(1) : 0;
                      
                      let grade = "F";
                      let gradeClass = "grade-f";
                      if (percentage >= 80) { grade = "A"; gradeClass = "grade-a"; }
                      else if (percentage >= 70) { grade = "B"; gradeClass = "grade-b"; }
                      else if (percentage >= 60) { grade = "C"; gradeClass = "grade-c"; }
                      else if (percentage >= 50) { grade = "D"; gradeClass = "grade-d"; }
                      
                      const isExpanded = expandedRow === item.id;
                      
                      return (
                        <>
                          <tr 
                            key={item.id} 
                            className={`grade-row ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => setExpandedRow(isExpanded ? null : item.id)}
                          >
                            <td className="assignment-cell">
                              <div className="assignment-info">
                                <div className="assignment-icon">
                                  {tab === "grades" ? <Award size={16} /> : <FileText size={16} />}
                                </div>
                                <div>
                                  <div className="assignment-title">
                                    {item.assignments?.title || "—"}
                                  </div>
                                  {item.remarks && (
                                    <div className="assignment-remarks">
                                      {item.remarks}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="subject-badge">
                                {item.assignments?.subjects?.name || "—"}
                              </span>
                            </td>
                            <td>
                              <span className={`marks-badge ${marksObtained >= 50 ? 'good' : 'poor'}`}>
                                {marksObtained}/{totalMarks}
                              </span>
                            </td>
                            <td>
                              <div className="percentage-container">
                                <div className="percentage-bar">
                                  <div 
                                    className="percentage-fill" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="percentage-text">{percentage}%</span>
                              </div>
                            </td>
                            <td>
                              <span className={`grade-badge ${gradeClass}`}>
                                {grade}
                              </span>
                            </td>
                            <td>
                              <div className="date-cell">
                                <Calendar size={14} />
                                <span>
                                  {item.graded_at 
                                    ? new Date(item.graded_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : "—"
                                  }
                                </span>
                              </div>
                            </td>
                            <td>
                              <button className="expand-button">
                                <ChevronDown size={16} className={isExpanded ? 'rotated' : ''} />
                              </button>
                            </td>
                          </tr>
                          
                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <tr className="expanded-row">
                              <td colSpan={7}>
                                <div className="expanded-content">
                                  <div className="details-grid">
                                    <div className="detail-item">
                                      <span className="detail-label">Feedback</span>
                                      <p className="detail-value">
                                        {item.feedback || "No feedback provided"}
                                      </p>
                                    </div>
                                    <div className="detail-item">
                                      <span className="detail-label">Submitted</span>
                                      <p className="detail-value">
                                        {item.submitted_at 
                                          ? new Date(item.submitted_at).toLocaleDateString('en-US', {
                                              month: 'long',
                                              day: 'numeric',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })
                                          : "Not recorded"
                                        }
                                      </p>
                                    </div>
                                    {item.file_url && (
                                      <div className="detail-item">
                                        <span className="detail-label">Attachment</span>
                                        <a 
                                          href={item.file_url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="detail-link"
                                        >
                                          <Download size={14} />
                                          Download Submission
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Performance Summary Card */}
              {stats && (
                <div className="performance-summary">
                  <h3 className="summary-title">
                    <TrendingUp size={18} />
                    Performance Summary
                  </h3>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <div className="summary-card-icon average">
                        <TrendingUp size={20} />
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-label">Average Score</span>
                        <span className="summary-card-value">{stats.average}%</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card-icon highest">
                        <Star size={20} />
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-label">Highest Score</span>
                        <span className="summary-card-value">{stats.highest}%</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card-icon lowest">
                        <BarChart3 size={20} />
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-label">Lowest Score</span>
                        <span className="summary-card-value">{stats.lowest}%</span>
                      </div>
                    </div>
                    <div className="summary-card">
                      <div className="summary-card-icon total">
                        <BookOpen size={20} />
                      </div>
                      <div className="summary-card-content">
                        <span className="summary-card-label">Total Items</span>
                        <span className="summary-card-value">{stats.count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MasomoPortalLayout>
  );
};

export default GradesResults;