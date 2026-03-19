import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { BarChart3, Loader2, Award, FileText } from "lucide-react";

const GradesResults = () => {
  const [grades, setGrades] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"grades" | "results">("grades");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [gRes, rRes] = await Promise.all([api.get("/student/grades"), api.get("/student/results")]);
        setGrades(gRes.data || []); setResults(rRes.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <MasomoPortalLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div></MasomoPortalLayout>;

  const data = tab === "grades" ? grades : results;

  return (
    <MasomoPortalLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"><BarChart3 size={28} className="text-green-500" /> Grades & Results</h1>
          <p className="text-muted-foreground">View your graded submissions and academic results.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("grades")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "grades" ? "bg-green-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <Award size={14} className="inline mr-1" /> Grades
          </button>
          <button onClick={() => setTab("results")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "results" ? "bg-green-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            <FileText size={14} className="inline mr-1" /> Results
          </button>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-20">
            <Award size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-500">No {tab} yet</h3>
            <p className="text-sm text-muted-foreground">Your {tab} will appear here once available.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="text-left p-4 text-xs font-bold uppercase text-slate-500">Assignment</th>
                  <th className="text-left p-4 text-xs font-bold uppercase text-slate-500">Subject</th>
                  <th className="text-left p-4 text-xs font-bold uppercase text-slate-500">Marks</th>
                  <th className="text-left p-4 text-xs font-bold uppercase text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium">{item.assignments?.title || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{item.assignments?.subjects?.name || "—"}</td>
                    <td className="p-4">
                      <span className={`font-bold ${(item.marks_obtained || 0) >= 50 ? "text-green-600" : "text-red-500"}`}>
                        {item.marks_obtained ?? "—"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{item.graded_at ? new Date(item.graded_at).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </MasomoPortalLayout>
  );
};

export default GradesResults;
