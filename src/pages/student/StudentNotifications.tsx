import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StudentPortalLayout from "@/components/StudentPortalLayout";
import api from "@/lib/api";
import { Bell, Loader2, CheckCircle } from "lucide-react";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get("/student/notifications"); setNotifications(data || []); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <StudentPortalLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div></StudentPortalLayout>;

  return (
    <StudentPortalLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"><Bell size={28} className="text-orange-500" /> Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest announcements and alerts.</p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-500">All caught up!</h3>
            <p className="text-sm text-muted-foreground">No notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n: any) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${n.is_read ? "bg-white" : "bg-blue-50 border-blue-100"}`}>
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${n.is_read ? "bg-slate-300" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800">{n.title}</h3>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  {n.type && <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">{n.type}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </StudentPortalLayout>
  );
};

export default StudentNotifications;
