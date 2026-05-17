import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// 0. Komponen Animasi Intro
import Loader from './components/ui/Loader';

// 0b. Komponen ScrollToTop — harus di LUAR <Routes> agar selalu aktif
import ScrollToTop from './components/ui/ScrollToTop';

// 1. Mengimpor Layout (Pembungkus Halaman)
import MainLayout  from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// 2. Mengimpor Halaman Publik
import Home          from './pages/Home';
import About         from './pages/About';
import Career        from './pages/Career';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Blog          from './pages/Blog';
import BlogDetail    from './pages/BlogDetail';
import Contact       from './pages/Contact';
import FAQ           from './pages/FAQ';
import NotFound      from './pages/NotFound';

// 3. Auth
import Login from './pages/admin/Login';

// 4. Dashboard
import Dashboard from './pages/admin/Dashboard';

// 5. Konten Website
import ManageHomepage     from './pages/admin/ManageHomepage';
import ManageProjects     from './pages/admin/ManageProjects';
import ManageUnits        from './pages/admin/ManageUnits';
import ManageServices     from './pages/admin/ManageServices';
import ManageArticles     from './pages/admin/ManageArticles';
import ManageGallery      from './pages/admin/ManageGallery';
import ManageTestimonials from './pages/admin/ManageTestimonials';

// 6. CRM & Leads
import ManageLeads        from './pages/admin/ManageLeads';
import ManageMessages     from './pages/admin/ManageMessages';
import ManageApplications from './pages/admin/ManageApplications';

// 7. Optimasi & Analitik
import ManageSEO          from './pages/admin/ManageSEO';
import ManageAnalytics    from './pages/admin/ManageAnalytics';

// 8. Notifikasi
import ManageNotifications from './pages/admin/ManageNotifications';

// 9. Sistem
import Settings from './pages/admin/Settings';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // LOGIKA: Sembunyikan Loader setelah 3.5 detik
    const timer = setTimeout(() => setShowIntro(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* LOGIKA: Animasi intro/splash screen saat pertama kali load */}
      <AnimatePresence mode="wait">
        {showIntro && <Loader />}
      </AnimatePresence>

      {/* ✅ LOGIKA: ScrollToTop diletakkan di LUAR <Routes> tapi masih
          di dalam BrowserRouter (dari main.jsx), sehingga useLocation()
          bisa terbaca dan scroll ke atas terpicu setiap kali route berubah */}
      <ScrollToTop />

      <Routes>

        {/* ── A. HALAMAN PUBLIK ─────────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/tentang-kami"  element={<About />} />
          <Route path="/karir"         element={<Career />} />
          <Route path="/proyek"        element={<Projects />} />
          <Route path="/proyek/:slug"  element={<ProjectDetail />} />
          <Route path="/artikel"       element={<Blog />} />
          <Route path="/artikel/:slug" element={<BlogDetail />} />
          <Route path="/kontak"        element={<Contact />} />
          <Route path="/faq"           element={<FAQ />} />
        </Route>

        {/* ── B. LOGIN ADMIN ────────────────────────────────── */}
        <Route path="/admin/login" element={<Login />} />

        {/* ── C. PANEL ADMIN ────────────────────────────────── */}
        <Route path="/admin" element={<AdminLayout />}>

          {/* LOGIKA: Redirect /admin → /admin/dashboard otomatis */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}
          <Route path="dashboard"     element={<Dashboard />} />

          {/* Notifikasi */}
          <Route path="notifications" element={<ManageNotifications />} />

          {/* Konten Website */}
          <Route path="homepage"      element={<ManageHomepage />} />
          <Route path="projects"      element={<ManageProjects />} />
          <Route path="units"         element={<ManageUnits />} />
          <Route path="services"      element={<ManageServices />} />
          <Route path="articles"      element={<ManageArticles />} />
          <Route path="gallery"       element={<ManageGallery />} />
          <Route path="testimonials"  element={<ManageTestimonials />} />

          {/* CRM & Leads */}
          <Route path="leads"         element={<ManageLeads />} />
          <Route path="messages"      element={<ManageMessages />} />
          <Route path="applications"  element={<ManageApplications />} />

          {/* Optimasi & Analitik */}
          <Route path="seo"           element={<ManageSEO />} />
          <Route path="analytics"     element={<ManageAnalytics />} />

          {/* Sistem */}
          <Route path="settings"      element={<Settings />} />

        </Route>

        {/* ── D. 404 NOT FOUND ──────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}