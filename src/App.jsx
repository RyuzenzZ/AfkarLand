import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSEO } from './hooks/useSEO';
import { initWebVitalsTracking } from './lib/analytics';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Loader from './components/ui/Loader';
import ScrollToTop from './components/ui/ScrollToTop';
import { AuthProvider } from './context/AuthContext';

const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Career = lazy(() => import('./pages/Career'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageHomepage = lazy(() => import('./pages/admin/ManageHomepage'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageArticles = lazy(() => import('./pages/admin/ManageArticles'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const ManageServices = lazy(() => import('./pages/admin/ManageServices'));
const ManageLeads = lazy(() => import('./pages/admin/ManageLeads'));
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'));
const ManageApplications = lazy(() => import('./pages/admin/ManageApplications'));
const ManageSiteplan = lazy(() => import('./pages/admin/ManageSiteplan'));
const ManageFinance = lazy(() => import('./pages/admin/ManageFinance'));
const ManagePerformance = lazy(() => import('./pages/admin/ManagePerformance'));
const ManageSEO = lazy(() => import('./pages/admin/ManageSEO'));
const ManageAnalytics = lazy(() => import('./pages/admin/ManageAnalytics'));
const ManageNotifications = lazy(() => import('./pages/admin/ManageNotifications'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  useSEO();

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const introDuration = reduceMotion ? 700 : 3000;
    const timer = setTimeout(() => setShowIntro(false), introDuration);
    const vitalsTimer = setTimeout(initWebVitalsTracking, introDuration + 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(vitalsTimer);
    };
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ top: 24 }}
        toastOptions={{
          duration: 3200,
          className: 'afkar-toast',
          style: {
            minWidth: '280px',
            maxWidth: '520px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.72)',
            background: 'rgba(255,255,255,0.92)',
            color: '#1f2937',
            boxShadow: '0 18px 48px rgba(15,23,42,0.16), 0 4px 14px rgba(15,23,42,0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            padding: '14px 16px',
            fontSize: '14px',
            fontWeight: 700,
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid rgba(34,197,94,0.18)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              border: '1px solid rgba(239,68,68,0.2)',
            },
          },
          loading: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {showIntro && <Loader />}

      <ScrollToTop />

      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tentang-kami" element={<About />} />
              <Route path="/karir" element={<Career />} />
              <Route path="/proyek" element={<Projects />} />
              <Route path="/proyek/:slug" element={<ProjectDetail />} />
              <Route path="/layanan" element={<Services />} />
              <Route path="/galeri" element={<Gallery />} />
              <Route path="/artikel" element={<Blog />} />
              <Route path="/artikel/:slug" element={<BlogDetail />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>

            <Route path="/admin/login" element={<AuthProvider><Login /></AuthProvider>} />

            <Route path="/admin" element={<AuthProvider><AdminLayout /></AuthProvider>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notifications" element={<ManageNotifications />} />

              <Route path="homepage" element={<ManageHomepage />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="articles" element={<ManageArticles />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="services" element={<ManageServices />} />

              <Route path="leads" element={<ManageLeads />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="applications" element={<ManageApplications />} />
              <Route path="siteplan" element={<ManageSiteplan />} />
              <Route path="finance" element={<ManageFinance />} />
              <Route path="performance" element={<ManagePerformance />} />

              <Route path="seo" element={<ManageSEO />} />
              <Route path="analytics" element={<ManageAnalytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
