import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// 0. Komponen Animasi Intro
import Loader from './components/ui/Loader';

// 0b. Komponen ScrollToTop
import ScrollToTop from './components/ui/ScrollToTop';

// 1. Layout
import MainLayout  from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// 2. Halaman Publik
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
import ManageArticles     from './pages/admin/ManageArticles';
import ManageGallery      from './pages/admin/ManageGallery';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageServices     from './pages/admin/ManageServices';   // ← BARU: Layanan Perusahaan

// 6. CRM & Leads
import ManageLeads        from './pages/admin/ManageLeads';
import ManageMessages     from './pages/admin/ManageMessages';
import ManageApplications from './pages/admin/ManageApplications';

// 7. Operasional Proyek
import ManageSiteplan     from './pages/admin/ManageSiteplan';   // ← BARU: Siteplan & Booking Unit

// 8. Keuangan & Performa
import ManageFinance      from './pages/admin/ManageFinance';    // ← BARU: Catatan Keuangan
import ManagePerformance  from './pages/admin/ManagePerformance'; // ← BARU: Leaderboard Marketing

// 9. Optimasi & Analitik
import ManageSEO       from './pages/admin/ManageSEO';
import ManageAnalytics from './pages/admin/ManageAnalytics';

// 10. Notifikasi
import ManageNotifications from './pages/admin/ManageNotifications';

// 11. Sistem
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

      <AnimatePresence mode="wait">
        {showIntro && <Loader />}
      </AnimatePresence>

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

          <Route path="dashboard"     element={<Dashboard />} />
          <Route path="notifications" element={<ManageNotifications />} />

          {/* Konten Website */}
          <Route path="homepage"      element={<ManageHomepage />} />
          <Route path="projects"      element={<ManageProjects />} />
          <Route path="articles"      element={<ManageArticles />} />
          <Route path="gallery"       element={<ManageGallery />} />
          <Route path="testimonials"  element={<ManageTestimonials />} />
          <Route path="services"      element={<ManageServices />} />     {/* ← BARU */}

          {/* CRM & Leads */}
          <Route path="leads"         element={<ManageLeads />} />
          <Route path="messages"      element={<ManageMessages />} />
          <Route path="applications"  element={<ManageApplications />} />

          {/* Operasional Proyek */}
          <Route path="siteplan"      element={<ManageSiteplan />} />     {/* ← BARU */}

          {/* Keuangan & Performa */}
          <Route path="finance"       element={<ManageFinance />} />      {/* ← BARU */}
          <Route path="performance"   element={<ManagePerformance />} />  {/* ← BARU */}

          {/* Optimasi & Analitik */}
          <Route path="seo"           element={<ManageSEO />} />
          <Route path="analytics"     element={<ManageAnalytics />} />

          {/* Sistem */}
          <Route path="settings"      element={<Settings />} />

        </Route>

        {/* ── D. 404 ────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}