import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Route render failed:', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600">Terjadi Kendala</p>
          <h1 className="mt-3 text-2xl font-heading font-black text-gray-900">Halaman gagal dimuat</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Silakan muat ulang halaman. Jika masalah berulang, cek data CMS atau koneksi layanan.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            <FiRefreshCw size={16} />
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }
}
