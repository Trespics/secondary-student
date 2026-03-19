import { useState, useEffect } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  File, Loader2, Download, Eye, Search, AlertTriangle, FileText
} from "lucide-react";
import "../styles/Materials.css";

const PastPapers = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportMaterialId, setReportMaterialId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/student/past-papers");
        setPapers(data || []);
        setFilteredPapers(data || []);
      } catch (err) {
        console.error("Failed to fetch past papers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredPapers(papers.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.subjects?.name?.toLowerCase().includes(query)
      ));
    } else {
      setFilteredPapers(papers);
    }
  }, [searchQuery, papers]);

  const handleReport = async () => {
    if (!reportMaterialId || !reason.trim()) return;
    setSubmittingReport(true);
    try {
      await api.post(`/student/materials/${reportMaterialId}/report`, { reason });
      alert("Material reported successfully.");
      setReportDialogOpen(false);
      setReason("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleViewPaper = (paper: any) => {
    const url = paper.file_url || paper.content_link;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <MasomoPortalLayout>
        <div className="materials-loading">
          <Loader2 className="loading-spinner" />
        </div>
      </MasomoPortalLayout>
    );
  }

  return (
    <MasomoPortalLayout>
      <div className="materials-container">
        <div className="materials-content">
          <div className="materials-header">
            <div className="header-left">
              <div className="header-icon-wrapper" style={{ background: '#f59e0b15' }}>
                <File className="header-icon" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h1 className="header-title">Past Exam Papers</h1>
                <p className="header-subtitle">Review previous exams to prepare for your success</p>
              </div>
            </div>
            <div className="header-search">
              <input
                type="text"
                className="search-input"
                placeholder="Search papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon" size={18} />
            </div>
          </div>

          <div className="materials-info">
            <p className="info-text">
              Showing <span className="info-highlight">{filteredPapers.length}</span> past papers
            </p>
          </div>

          {filteredPapers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FileText className="empty-icon" />
              </div>
              <h3 className="empty-title">No past papers found</h3>
              <p className="empty-description">
                {searchQuery ? "No past papers match your search." : "No past papers have been uploaded for your classes yet."}
              </p>
            </div>
          ) : (
            <div className="materials-grid">
              {filteredPapers.map((paper, index) => (
                <div key={paper.id} className="material-card-wrapper" style={{ animationDelay: `${index * 0.03}s` }}>
                  <div className="material-card" onClick={() => handleViewPaper(paper)}>
                    <div className="material-card-header">
                      <div className="material-type-badge" style={{ background: `#f59e0b15`, color: '#f59e0b' }}>
                        <File size={14} />
                        <span>Past Paper</span>
                      </div>
                      <button className="report-button" onClick={(e) => { e.stopPropagation(); setReportMaterialId(paper.id); setReportDialogOpen(true); }}>
                        <AlertTriangle size={14} />
                      </button>
                    </div>
                    <div className="material-card-content">
                      <div className="material-icon-wrapper" style={{ background: `#f59e0b15` }}>
                        <File size={24} style={{ color: '#f59e0b' }} />
                      </div>
                      <h3 className="material-title">{paper.title}</h3>
                      <p className="material-subject">{paper.subjects?.name}</p>
                      <p className="material-teacher">By {paper.users?.name || "Teacher"}</p>
                    </div>
                    <div className="material-card-footer">
                      <span className="material-class">{paper.classes?.name}</span>
                      <div className="material-actions">
                        {paper.content_link && <a href={paper.content_link} target="_blank" rel="noopener noreferrer" className="action-button view-button" onClick={(e) => e.stopPropagation()}><Eye size={16} /></a>}
                        {paper.file_url && <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="action-button download-button" onClick={(e) => e.stopPropagation()}><Download size={16} /></a>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {reportDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <AlertTriangle className="modal-icon" size={24} />
              <h3 className="modal-title">Report Content</h3>
              <button className="modal-close" onClick={() => setReportDialogOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <textarea className="modal-textarea" placeholder="Why are you reporting this past paper?" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
            </div>
            <div className="modal-footer">
              <button className="modal-button cancel-button" onClick={() => setReportDialogOpen(false)}>Cancel</button>
              <button className="modal-button submit-button" onClick={handleReport} disabled={submittingReport || !reason.trim()}>{submittingReport ? "Submitting..." : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </MasomoPortalLayout>
  );
};

export default PastPapers;
