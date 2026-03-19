import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Toaster } from "sonner";

// Public pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";

// Auth pages
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";

// Student Portal pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentProfile from "@/pages/student/StudentProfile";
import StudentNotifications from "@/pages/student/StudentNotifications";

// Masomo Portal pages
import MasomoDashboard from "@/pages/masomo/MasomoDashboard";
import Subjects from "@/pages/masomo/Subjects";
import CourseDetails from "@/pages/masomo/CourseDetails";
import Materials from "@/pages/masomo/Materials";
import Assignments from "@/pages/masomo/Assignments";
import GradesResults from "@/pages/masomo/GradesResults";
import CATs from "@/pages/masomo/CATs";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  // We can't use useSearchParams here outside of BrowserRouter. 
  // We will handle redirect logic inside the component.
  if (isAuthenticated) {
    // Basic redirect logic if already authenticated
    const searchParams = new URLSearchParams(window.location.search);
    const redirectParams = searchParams.get("redirect") || "/student";
    return <Navigate to={redirectParams} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth */}
            <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Portal (Protected) */}
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />

            {/* Masomo Portal (Protected) */}
            <Route path="/masomo" element={<ProtectedRoute><MasomoDashboard /></ProtectedRoute>} />
            <Route path="/masomo/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
            <Route path="/masomo/subjects/:courseId" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/masomo/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
            <Route path="/masomo/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
            <Route path="/masomo/grades" element={<ProtectedRoute><GradesResults /></ProtectedRoute>} />
            <Route path="/masomo/cats" element={<ProtectedRoute><CATs /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
