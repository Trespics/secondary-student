import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MasomoPortalLayout from "@/components/MasomoPortalLayout";
import api from "@/lib/api";
import { Loader2, ArrowLeft, FileText, Video, ClipboardCheck, File, Download, Eye, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<"notes" | "videos" | "assignments" | "pastpapers">("notes");
  const [subjectInfo, setSubjectInfo] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get subject info (from the student's enrolled subjects)
        const subRes = await api.get("/student/subjects");
        const subject = subRes.data?.find((s: any) => s.subject_id === parseInt(courseId || "0"));
        setSubjectInfo(subject);

        // Fetch materials and filter by subject locally (or could pass subject_id if backend supports)
        const matRes = await api.get("/student/materials");
        const allMaterials = matRes.data || [];
        setMaterials(allMaterials.filter((m: any) => m.subject_id === parseInt(courseId || "0")));

        // Fetch assignments
        const assignRes = await api.get("/student/assignments");
        const allAssigns = assignRes.data || [];
        setAssignments(allAssigns.filter((a: any) => a.subject_id === parseInt(courseId || "0")));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchData();
  }, [courseId]);

  if (loading) return <MasomoPortalLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div></MasomoPortalLayout>;

  if (!subjectInfo) return (
    <MasomoPortalLayout>
      <div className="text-center py-20">
        <h3 className="text-xl font-bold mb-2">Subject Not Found</h3>
        <p className="text-muted-foreground mb-6">You may not be enrolled in this subject.</p>
        <Link to="/masomo/subjects" className="text-purple-600 hover:underline">← Back to Subjects</Link>
      </div>
    </MasomoPortalLayout>
  );

  const notes = materials.filter(m => m.type === "Notes" || m.type === "Book");
  const videos = materials.filter(m => m.type === "Video" || m.type === "Audio");
  const pastPapers = materials.filter(m => m.type === "Past Paper");

  const isOverdue = (date: string) => new Date(date) < new Date();

  const MaterialCard = ({ item, icon: Icon }: { item: any, icon: any }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all mb-3">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0"><Icon size={20} /></div>
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-xs text-muted-foreground">Added: {new Date(item.created_at).toLocaleDateString()} • By {item.users?.name || "Teacher"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.content_link && <a href={item.content_link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"><Eye size={16} /></a>}
        {item.file_url && <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors text-purple-600"><Download size={16} /></a>}
      </div>
    </motion.div>
  );

  return (
    <MasomoPortalLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <Link to="/masomo/subjects" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Subjects
        </Link>
        
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
              {subjectInfo.subjects?.name?.substring(0, 2)}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{subjectInfo.subjects?.name}</h1>
              <p className="text-muted-foreground">{subjectInfo.classes?.name} • Teacher: {subjectInfo.users?.name || "TBD"}</p>
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto hide-scrollbar">
          {[
            { id: "notes", label: "Notes", icon: FileText, count: notes.length },
            { id: "videos", label: "Videos", icon: Video, count: videos.length },
            { id: "assignments", label: "Assignments", icon: ClipboardCheck, count: assignments.length },
            { id: "pastpapers", label: "Past Papers", icon: File, count: pastPapers.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-purple-600 text-purple-700" 
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-500"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === "notes" && (
            <div>
              {notes.length === 0 ? <p className="text-muted-foreground text-center py-10">No notes uploaded yet.</p> : 
                notes.map(n => <MaterialCard key={n.id} item={n} icon={FileText} />)}
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              {videos.length === 0 ? <p className="text-muted-foreground text-center py-10">No videos uploaded yet.</p> : 
                videos.map(v => <MaterialCard key={v.id} item={v} icon={Video} />)}
            </div>
          )}

          {activeTab === "pastpapers" && (
            <div>
              {pastPapers.length === 0 ? <p className="text-muted-foreground text-center py-10">No past papers uploaded yet.</p> : 
                pastPapers.map(p => <MaterialCard key={p.id} item={p} icon={File} />)}
            </div>
          )}

          {activeTab === "assignments" && (
            <div>
              {assignments.length === 0 ? <p className="text-muted-foreground text-center py-10">No assignments for this subject.</p> : 
                assignments.map((a: any, i) => {
                  const overdue = a.due_date && isOverdue(a.due_date);
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all mb-4 ${overdue ? "border-red-200" : ""}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{a.title}</h3>
                            {a.is_mcq && <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">MCQ</span>}
                          </div>
                          {a.instructions && <p className="text-sm text-slate-600 mb-2">{a.instructions}</p>}
                          <div className="flex items-center gap-4 text-xs">
                            {a.due_date && (
                              <span className={`flex items-center gap-1 ${overdue ? "text-red-600" : "text-orange-600"}`}>
                                {overdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                                Due: {new Date(a.due_date).toLocaleDateString()} {overdue && "(Overdue)"}
                              </span>
                            )}
                            {a.time_limit_minutes && <span className="text-slate-500">⏱ {a.time_limit_minutes} min</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {a.file_url && (
                            <a href={a.file_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-1"><Download size={14} /> Download</Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </motion.div>
    </MasomoPortalLayout>
  );
};

export default CourseDetails;
