import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { Calendar, Clock, Loader2, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CATs = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get("/student/cats"); setCats(data || []); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getStatus = (cat: any) => {
    const now = new Date();
    if (cat.end_time && new Date(cat.end_time) < now) return { label: "Completed", color: "bg-slate-100 text-slate-600" };
    if (cat.start_time && new Date(cat.start_time) <= now) return { label: "In Progress", color: "bg-green-100 text-green-700" };
    return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
  };

  if (loading) return <MasomoPortalLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div></MasomoPortalLayout>;

  return (
    <MasomoPortalLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"><ClipboardCheck size={28} className="text-indigo-500" /> CATs</h1>
          <p className="text-muted-foreground">Continuous Assessment Tests schedule and details.</p>
        </div>

        {cats.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-500">No CATs scheduled</h3>
            <p className="text-sm text-muted-foreground">CATs will appear here when scheduled by your teachers.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cats.map((cat: any, i) => {
              const status = getStatus(cat);
              return (
                <motion.div key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{cat.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{cat.subjects?.name} • {cat.classes?.name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        {cat.start_time && <span className="flex items-center gap-1"><Calendar size={12} /> Start: {new Date(cat.start_time).toLocaleString()}</span>}
                        {cat.end_time && <span className="flex items-center gap-1"><Clock size={12} /> End: {new Date(cat.end_time).toLocaleString()}</span>}
                        {cat.time_limit_minutes && <span>⏱ {cat.time_limit_minutes} min</span>}
                      </div>
                    </div>
                    {!status.label.includes("Completed") && (
                      <Button 
                        onClick={() => navigate(`/masomo/cats/${cat.id}/take`)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6"
                      >
                        Take CAT
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </MasomoPortalLayout>
  );
};

export default CATs;
