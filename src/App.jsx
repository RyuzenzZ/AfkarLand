import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSEO } from './hooks/useSEO';
import { initWebVitalsTracking } from './lib/analytics';
import Loader from './components/ui/Loader';
import ScrollToTop from './components/ui/ScrollToTop';

const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Career = lazy(() => import('./pages/Career'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
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
    const timer = setTimeout(() => setShowIntro(false), 3500);
    initWebVitalsTracking();
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <AnimatePresence mode="wait">
        {showIntro && <Loader />}
      </AnimatePresence>

      <ScrollToTop />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/karir" element={<Career />} />
            <Route path="/proyek" element={<Projects />} />
            <Route path="/proyek/:slug" element={<ProjectDetail />} />
            <Route path="/artikel" element={<Blog />} />
            <Route path="/artikel/:slug" element={<BlogDetail />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
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
    </>
  );
}
