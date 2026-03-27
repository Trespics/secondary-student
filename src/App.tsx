import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Toaster } from "sonner";

// Public pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsofService";

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
import Books from "@/pages/masomo/Books";
import PastPapers from "@/pages/masomo/PastPapers";
import Assignments from "@/pages/masomo/Assignments";
import TakeAssignment from "@/pages/masomo/TakeAssignment";
import GradesResults from "@/pages/masomo/GradesResults";
import CATs from "@/pages/masomo/CATs";
import TakeCAT from "@/pages/masomo/TakeCAT";
import ReportCard from "@/pages/masomo/ReportCard";
import MasomoLogin from "./pages/masomo/MasomoLogin";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function ProtectedRoute({ children, loginPath = "/login" }: { children: React.ReactNode, loginPath?: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <>{children}</>;
}

function AuthRedirect({ children, defaultRedirect = "/student" }: { children: React.ReactNode, defaultRedirect?: string }) {
  const { isAuthenticated } = useAuth();
  // We can't use useSearchParams here outside of BrowserRouter. 
  // We will handle redirect logic inside the component.
  if (isAuthenticated) {
    // Basic redirect logic if already authenticated
    const searchParams = new URLSearchParams(window.location.search);
    const redirectParams = searchParams.get("redirect") || defaultRedirect;
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
   
            {/* Auth */}
            <Route path="/login" element={<AuthRedirect defaultRedirect="/student"><Login /></AuthRedirect>} />
            <Route path="/masomo/login" element={<AuthRedirect defaultRedirect="/masomo"><MasomoLogin/></AuthRedirect>}/>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Portal (Protected) */}
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><StudentNotifications /></ProtectedRoute>} />

            {/* Masomo Portal (Protected) */}
            <Route path="/masomo" element={<ProtectedRoute loginPath="/masomo/login"><MasomoDashboard /></ProtectedRoute>} />
            <Route path="/masomo/subjects" element={<ProtectedRoute loginPath="/masomo/login"><Subjects /></ProtectedRoute>} />
            <Route path="/masomo/subjects/:courseId" element={<ProtectedRoute loginPath="/masomo/login"><CourseDetails /></ProtectedRoute>} />
            <Route path="/masomo/materials" element={<ProtectedRoute loginPath="/masomo/login"><Materials /></ProtectedRoute>} />
            <Route path="/masomo/books" element={<ProtectedRoute loginPath="/masomo/login"><Books /></ProtectedRoute>} />
            <Route path="/masomo/past-papers" element={<ProtectedRoute loginPath="/masomo/login"><PastPapers /></ProtectedRoute>} />
            <Route path="/masomo/assignments" element={<ProtectedRoute loginPath="/masomo/login"><Assignments /></ProtectedRoute>} />
            <Route path="/masomo/assignments/:id/take" element={<ProtectedRoute loginPath="/masomo/login"><TakeAssignment /></ProtectedRoute>} />
            <Route path="/masomo/grades" element={<ProtectedRoute loginPath="/masomo/login"><GradesResults /></ProtectedRoute>} />
            <Route path="/masomo/cats" element={<ProtectedRoute loginPath="/masomo/login"><CATs /></ProtectedRoute>} />
            <Route path="/masomo/cats/:id/take" element={<ProtectedRoute loginPath="/masomo/login"><TakeCAT /></ProtectedRoute>} />
            <Route path="/masomo/report-card" element={<ProtectedRoute loginPath="/masomo/login"><ReportCard /></ProtectedRoute>} />
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
