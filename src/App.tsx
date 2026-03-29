import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Toaster } from "sonner";

// Public pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsofService"));

// Auth pages
const Login = lazy(() => import("@/pages/Login"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Student Portal pages
const StudentDashboard = lazy(() => import("@/pages/student/StudentDashboard"));
const StudentProfile = lazy(() => import("@/pages/student/StudentProfile"));
const StudentNotifications = lazy(() => import("@/pages/student/StudentNotifications"));

// Masomo Portal pages
const MasomoDashboard = lazy(() => import("@/pages/masomo/MasomoDashboard"));
const Subjects = lazy(() => import("@/pages/masomo/Subjects"));
const CourseDetails = lazy(() => import("@/pages/masomo/CourseDetails"));
const Materials = lazy(() => import("@/pages/masomo/Materials"));
const Books = lazy(() => import("@/pages/masomo/Books"));
const PastPapers = lazy(() => import("@/pages/masomo/PastPapers"));
const Assignments = lazy(() => import("@/pages/masomo/Assignments"));
const TakeAssignment = lazy(() => import("@/pages/masomo/TakeAssignment"));
const GradesResults = lazy(() => import("@/pages/masomo/GradesResults"));
const CATs = lazy(() => import("@/pages/masomo/CATs"));
const TakeCAT = lazy(() => import("@/pages/masomo/TakeCAT"));
const ReportCard = lazy(() => import("@/pages/masomo/ReportCard"));
const MasomoLogin = lazy(() => import("./pages/masomo/MasomoLogin"));

const LoadingFallback = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

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
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
