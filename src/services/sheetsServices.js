import axios from 'axios';

// LOGIKA: Fungsi ini mengirim data ke proxy server atau Firebase Cloud Function 
// yang bertugas mengeksekusi Google Sheets API dengan Service Account Key.
// Catatan: Service Account JSON TIDAK BOLEH diletakkan di frontend (React) demi keamanan.

const GOOGLE_SHEETS_PROXY_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || '';

export const appendLeadToSheet = async (leadData) => {
  if (!GOOGLE_SHEETS_PROXY_URL) return; // Skip jika webhook belum disetup
  
  try {
    await axios.post(GOOGLE_SHEETS_PROXY_URL, {
      tab: 'Lead_Masuk',
      data: {
        Tanggal: new Date().toLocaleDateString('id-ID'),
        Nama: leadData.nama,
        Telepon: leadData.nomorWa,
        Pilihan_Project: leadData.pilihanProject,
        Estimasi_Budget: leadData.estimasiBudget,
        Pesan: leadData.pesan || '-'
      }
    });
    console.log('Berhasil mencatat lead ke Google Sheets');
  } catch (error) {
    console.error('[VIBE ARCHITECT ERROR]: Gagal mencatat ke Sheets', error);
    // Tidak di-throw agar tidak mengganggu flow UI jika Sheets gagal tapi Firestore sukses
  }
};