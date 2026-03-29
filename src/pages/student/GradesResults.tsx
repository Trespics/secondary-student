import { useState, useEffect } from "react";
import StudentPortalLayout from "@/components/StudentPortalLayout";
import api from "@/lib/api";
import { 
  BarChart3, Loader2, Filter, Printer, FileText
} from "lucide-react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const GradesResults = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTerm, setFilterTerm] = useState<string>("all");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rRes = await api.get("/student/exam-results");
        setResults(rRes.data || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const getUniqueTerms = () => {
    const terms = results.map(item => item.term).filter(Boolean);
    return ["all", ...new Set(terms)];
  };

  const calculateOverallGrade = (score: number) => {
    if (score >= 75) return "EE";
    if (score >= 50) return "ME";
    if (score >= 25) return "AE";
    return "BE";
  };

  const getOverallGradeString = (scores: Record<string, number>) => {
    const values = Object.values(scores).filter(s => !isNaN(s));
    if (values.length === 0) return "-";
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return `${avg.toFixed(1)}% (${calculateOverallGrade(avg)})`;
  };

  const getFilteredData = () => {
    let filtered = [...results];
    
    // Apply Term filter
    if (filterTerm !== "all") {
      filtered = filtered.filter(item => 
        item.term === filterTerm
      );
    }
    
    return filtered;
  };

  const downloadPDF = async () => {
    const element = document.getElementById('results-pdf-container');
    if (!element) return;
    
    setDownloading(true);
    try {
      const dataUrl = await toPng(element, { 
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement && node.hasAttribute('data-html2canvas-ignore')) {
            return false;
          }
          return true;
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('My_Academic_Results.pdf');
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <StudentPortalLayout>
        <div className="flex h-full w-full items-center justify-center p-24">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      </StudentPortalLayout>
    );
  }

  const filteredData = getFilteredData();
  const terms = getUniqueTerms();

  // Get all unique subjects from results to form the horizontal columns
  const uniqueSubjects = Array.from(new Set(filteredData.map((r: any) => r.subjects?.name || "Subject")));

  // Group by Exam Session (Class, Year, Term, Exam Type)
  const groupedExams = new Map<string, any>();
  
  filteredData.forEach((r: any) => {
    const key = `${r.class_id}-${r.year}-${r.term}-${r.exam_type}`;
    if (!groupedExams.has(key)) {
      groupedExams.set(key, {
        className: r.classes?.name || "N/A",
        year: r.year,
        term: r.term,
        examType: r.exam_type,
        timestamp: new Date(r.created_at || 0).getTime(),
        scores: {}
      });
    }
    groupedExams.get(key).scores[r.subjects?.name || "Subject"] = parseFloat(r.score);
  });

  // Sort by newest first
  const tableData = Array.from(groupedExams.values()).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <StudentPortalLayout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Exam Results</h1>
                <p className="text-muted-foreground mt-1">
                  View and download your official CBC academic results
                </p>
              </div>
            </div>
            
            <button 
              onClick={downloadPDF}
              disabled={downloading || tableData.length === 0}
              className="px-4 py-2 bg-indigo-600 font-medium text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {downloading ? <Loader2 size={18} className="animate-spin" /> : <Printer size={18} />}
              Print / Download PDF
            </button>
          </div>

          <div id="results-pdf-container" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {filteredData.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 mb-6" data-html2canvas-ignore>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <Filter size={16} className="text-slate-500" />
                  <select 
                    className="bg-transparent border-none outline-none text-sm text-slate-700 w-32"
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                  >
                    {terms.map(term => (
                      <option key={term} value={term}>
                        {term === "all" ? "All Terms" : term}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {tableData.length === 0 ? (
              <div className="flex flex-col items-center py-24 px-4 text-center">
                <FileText className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">No Results Found</h3>
                <p className="text-slate-500 max-w-sm mt-1">
                  You don't have any published exam records yet. Check back later once teachers upload your results.
                </p>
                {filterTerm !== "all" && (
                  <button 
                    className="mt-6 px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
                    onClick={() => setFilterTerm("all")}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="min-w-[150px] font-bold sticky left-0 z-10 bg-slate-50">Class & Year</TableHead>
                      <TableHead className="min-w-[150px] font-bold text-center">Term / Exam</TableHead>
                      {uniqueSubjects.map(sub => (
                        <TableHead key={sub} className="min-w-[100px] text-center font-bold">
                          {sub}
                        </TableHead>
                      ))}
                      <TableHead className="min-w-[120px] text-right font-bold bg-slate-50">Overall Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/10">
                        <TableCell className="font-medium sticky left-0 z-10 bg-white shadow-[1px_0_0_0_#e5e7eb]">
                          {row.className} - {row.year}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {row.term} / {row.examType}
                        </TableCell>
                        {uniqueSubjects.map(sub => {
                          const score = row.scores[sub];
                          const displayScore = score !== undefined ? `${score}%` : "-";
                          return (
                            <TableCell key={sub} className="text-center">
                              {displayScore}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-right font-bold bg-white shadow-[-1px_0_0_0_#e5e7eb]">
                          {getOverallGradeString(row.scores)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default GradesResults;