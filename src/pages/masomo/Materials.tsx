import React from "react";
import { useState, useEffect } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  FileText, Loader2, Download, Eye, Search, Video, 
  Headphones, BookOpen, File, AlertTriangle,
  FileSpreadsheet, Presentation, Music, Film, Library
} from "lucide-react";
import "../styles/Materials.css";

const typeIcons: Record<string, any> = { 
  Notes: FileText, 
  Video: Video, 
  Audio: Headphones, 
  Book: BookOpen, 
  "Past Paper": File,
  Assignment: FileSpreadsheet,
  Presentation: Presentation,
  Recording: Music,
  Lecture: Film,
  Reference: Library
};

const typeColors: Record<string, string> = {
  Notes: '#3b82f6',
  Video: '#8b5cf6',
  Audio: '#ec4899',
  Book: '#10b981',
  'Past Paper': '#f59e0b',
  Assignment: '#6366f1',
  Presentation: '#ef4444',
  Recording: '#14b8a6',
  Lecture: '#f97316',
  Reference: '#6b7280'
};

const Materials = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("all");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportMaterialId, setReportMaterialId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const [materialsRes, pastPapersRes] = await Promise.all([
          api.get("/student/materials"),
          api.get("/student/past-papers")
        ]);
        
        const mats = (materialsRes.data || []).map((m: any) => ({ ...m, _table: 'materials' }));
        const papers = (pastPapersRes.data || []).map((p: any) => ({ ...p, _table: 'past_papers', type: 'Past Paper' }));
        
        setMaterials([...mats, ...papers]);
      } catch (err) { 
        console.error("Failed to fetch materials:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchMaterials();
  }, []);

  // Filter materials based on active type and search query
  useEffect(() => {
    let filtered = materials;
    
    // Filter by type
    if (activeType !== "all") {
      filtered = filtered.filter(m => m.type === activeType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.title?.toLowerCase().includes(query) ||
        m.subjects?.name?.toLowerCase().includes(query) ||
        m.type?.toLowerCase().includes(query)
      );
    }
    
    setFilteredMaterials(filtered);
  }, [activeType, materials, searchQuery]);

  // Get unique material types for navigation
  const materialTypes = ["all", ...new Set(materials.map(m => m.type).filter(Boolean))];

  const handleReport = async () => {
    if (!reportMaterialId || !reason.trim()) {
      alert("Please provide a reason for the report.");
      return;
    }

    setSubmittingReport(true);
    try {
      await api.post(`/student/materials/${reportMaterialId}/report`, { reason });
      alert("Material reported successfully. The teacher will review it.");
      setReportDialogOpen(false);
      setReason("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const Icon = typeIcons[type] || FileText;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    return typeColors[type] || '#6b7280';
  };

  const handleViewMaterial = (material: any) => {
    const url = material.file_url || material.content_link;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
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
          {/* Header Section */}
          <div className="materials-header">
            <div className="header-left">
              <div className="header-icon-wrapper">
                <FileText className="header-icon" />
              </div>
              <div>
                <h1 className="header-title">Learning Materials</h1>
                <p className="header-subtitle">
                  Access notes, videos, past papers, and more learning resources
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            {/* <div className="header-search">
              <input
                type="text"
                className="search-input"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon" size={18} />
            </div> */}
          </div>      

          {/* Material Types Navigation */}
          <div className="materials-nav">
            {materialTypes.map((type) => (
              <button
                key={type}
                className={`nav-item ${activeType === type ? 'active' : ''}`}
                onClick={() => setActiveType(type)}
                style={activeType === type && type !== 'all' ? { 
                  borderColor: getTypeColor(type),
                  color: getTypeColor(type)
                } : {}}
              >
                {type === 'all' ? (
                  <>
                    <FileText size={16} />
                    <span>All Materials</span>
                  </>
                ) : (
                  <>
                    {React.createElement(getTypeIcon(type), { size: 16 })}
                    <span>{type}</span>
                  </>
                )}
                {type !== 'all' && (
                  <span className="nav-count" style={{ background: getTypeColor(type) }}>
                    {materials.filter(m => m.type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="materials-info">
            <p className="info-text">
              Showing <span className="info-highlight">{filteredMaterials.length}</span> materials
              {activeType !== "all" && ` in ${activeType}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <FileText className="empty-icon" />
              </div>
              <h3 className="empty-title">No materials found</h3>
              <p className="empty-description">
                {searchQuery 
                  ? "No materials match your search criteria. Try different keywords."
                  : activeType !== "all"
                  ? `No ${activeType} materials available for your classes.`
                  : "No materials available for your classes."}
              </p>
              {(activeType !== "all" || searchQuery) && (
                <button 
                  className="empty-action"
                  onClick={() => {
                    setActiveType("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="materials-grid">
              {filteredMaterials.map((material, index) => {
                const Icon = getTypeIcon(material.type);
                const color = getTypeColor(material.type);
                
                return (
                  <div 
                    key={material.id} 
                    className="material-card-wrapper"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div 
                      className="material-card"
                      onClick={() => handleViewMaterial(material)}
                    >
                      {/* Card Header */}
                      <div className="material-card-header">
                        <div className="material-type-badge" style={{ background: `${color}15`, color: color }}>
                          <Icon size={14} />
                          <span>{material.type}</span>
                        </div>
                        <button
                          className="report-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportMaterialId(material.id);
                            setReportDialogOpen(true);
                          }}
                          title="Report inappropriate content"
                        >
                          <AlertTriangle size={14} />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="material-card-content">
                        <div className="material-icon-wrapper" style={{ background: `${color}15` }}>
                          <Icon size={24} style={{ color }} />
                        </div>
                        <h3 className="material-title">{material.title}</h3>
                        <p className="material-subject">{material.subjects?.name}</p>
                        <p className="material-teacher">By {material.users?.name || "Teacher"}</p>
                      </div>

                      {/* Card Footer */}
                      <div className="material-card-footer">
                        <span className="material-class">{material.classes?.name}</span>
                        <div className="material-actions">
                          {material.content_link && (
                            <a 
                              href={material.content_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="action-button view-button"
                              title="View online"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye size={16} />
                            </a>
                          )}
                          {material.file_url && (
                            <a 
                              href={material.file_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="action-button download-button"
                              title="Download"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download size={16} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="card-hover-overlay" style={{ background: `${color}05` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Report Dialog - Simple Modal */}
      {reportDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <AlertTriangle className="modal-icon" size={24} />
              <h3 className="modal-title">Report Material</h3>
              <button className="modal-close" onClick={() => setReportDialogOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Is this material inappropriate, incorrect, or low quality? Tell us why.
              </p>
              <textarea
                className="modal-textarea"
                placeholder="Provide a reason for reporting this material..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="modal-footer">
              <button 
                className="modal-button cancel-button"
                onClick={() => setReportDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button submit-button"
                onClick={handleReport}
                disabled={submittingReport || !reason.trim()}
              >
                {submittingReport ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MasomoPortalLayout>
  );
};

export default Materials;