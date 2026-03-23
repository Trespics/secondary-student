import { useState, useEffect } from "react";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { 
  BookOpen, Loader2, Download, Eye, Search, AlertTriangle, Library
} from "lucide-react";
import "../styles/Books.css";

const Books = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportMaterialId, setReportMaterialId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const [materialsRes, libraryRes] = await Promise.all([
          api.get("/student/materials"),
          api.get("/library/items?type=Book")
        ]);

        const classBooks = (materialsRes.data || [])
          .filter((m: any) => m.type === "Book")
          .map((m: any) => ({
            ...m,
            source: "Class Material",
            displaySubject: m.subjects?.name || "N/A",
            displayAuthor: m.users?.name || "Teacher",
            displayClass: m.classes?.name || "N/A",
            iconColor: "#10b981"
          }));

        const libraryBooksDirect = (libraryRes.data || []).map((l: any) => ({
          ...l,
          source: "Library",
          displaySubject: l.library_categories?.name || "Library",
          displayAuthor: l.author || "Unknown",
          displayClass: "General",
          iconColor: "#3b82f6",
          // Map file_url to common field if needed, but Books.tsx uses book.file_url || book.content_link
        }));

        const combined = [...classBooks, ...libraryBooksDirect];
        setBooks(combined);
        setFilteredBooks(combined);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredBooks(books.filter(b => 
        b.title?.toLowerCase().includes(query) ||
        b.displaySubject?.toLowerCase().includes(query) ||
        b.displayAuthor?.toLowerCase().includes(query)
      ));
    } else {
      setFilteredBooks(books);     
    }
  }, [searchQuery, books]);

  const handleReport = async () => {
    if (!reportMaterialId || !reason.trim()) return;
    
    // Find the book to check its source
    const book = books.find(b => b.id === reportMaterialId);
    if (book?.source === "Library") {
      alert("Reporting for library items is handled by administrators. Please contact support.");
      setReportDialogOpen(false);
      return;
    }

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

  const handleViewBook = (book: any) => {
    const url = book.file_url || book.content_link;
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
              <div className="header-icon-wrapper" >
                <BookOpen className="header-icon"/>
              </div>
              <div>
                <h1 className="header-title">Books & Textbooks</h1>
                <p className="header-subtitle">Access all recommended books from your classes and library</p>
              </div>
            </div>
            <div className="header-search">
              <input
                type="text"
                className="search-input"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="search-icon" size={18} />
            </div>
          </div>
{/* 
          <div className="materials-info">
            <p className="info-text">
              Showing <span className="info-highlight">{filteredBooks.length}</span> books
            </p>
          </div> */}

          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <Library className="empty-icon" />
              </div>
              <h3 className="empty-title">No books found</h3>
              <p className="empty-description">
                {searchQuery ? "No books match your search." : "No books have been found in your classes or library."}
              </p>
            </div>
          ) : (
            <div className="materials-grid">
              {filteredBooks.map((book, index) => (
                <div key={`${book.source}-${book.id}`} className="material-card-wrapper" style={{ animationDelay: `${index * 0.03}s` }}>
                  <div className="material-card" onClick={() => handleViewBook(book)}>
                    <div className="material-card-header">
                      <div className="material-type-badge" style={{ background: `${book.iconColor}15`, color: book.iconColor }}>
                        <Library size={14} />
                        <span>{book.source}</span>
                      </div>
                      {book.source !== "Library" && (
                        <button className="report-button" onClick={(e) => { e.stopPropagation(); setReportMaterialId(book.id); setReportDialogOpen(true); }}>
                          <AlertTriangle size={14} />
                        </button>
                      )}
                    </div>
                    <div className="material-card-content">
                      <div className="material-icon-wrapper" style={{ background: `${book.iconColor}15` }}>
                        <BookOpen size={24} style={{ color: book.iconColor }} />
                      </div>
                      <h3 className="material-title">{book.title}</h3>
                      <p className="material-subject">{book.displaySubject}</p>
                      <p className="material-teacher">By {book.displayAuthor}</p>
                    </div>
                    <div className="material-card-footer">
                      <span className="material-class">{book.displayClass}</span>
                      <div className="material-actions">
                        {(book.content_link || book.file_url) && (
                          <a href={book.file_url || book.content_link} target="_blank" rel="noopener noreferrer" className="action-button view-button" onClick={(e) => e.stopPropagation()}>
                            <Eye size={16} />
                          </a>
                        )}
                        {book.file_url && (
                          <a href={book.file_url} target="_blank" rel="noopener noreferrer" className="action-button download-button" onClick={(e) => e.stopPropagation()}>
                            <Download size={16} />
                          </a>
                        )}
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
              <textarea className="modal-textarea" placeholder="Why are you reporting this book?" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
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

export default Books;
