import React from 'react';
import { motion } from 'framer-motion';

// LOGIKA: Menampilkan struktur organisasi perusahaan secara dinamis
export default function Team() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Data Tim berdasarkan input pengguna
  const teamCategories = [
    {
      category: 'Pimpinan & Manajemen',
      members: [
        { name: 'Ustadz Haris Amrin', role: 'Direktur Utama' },
        { name: 'Nia Kartika Putri', role: 'Manajer Operasional' },
      ]
    },
    {
      category: 'Tim Teknis & HRD',
      members: [
        { name: 'Abdi Negara', role: 'HRD' },
        { name: 'Sultan Alfatih', role: 'Tim Teknis Lapangan' },
      ]
    },
    {
      category: 'Marketing Executive',
      members: [
        { name: 'Damar Mahendra', role: 'Marketing Executive' },
        { name: 'Fila Amelia', role: 'Marketing Executive' },
        { name: 'Hazfira', role: 'Marketing Executive' },
        { name: 'Rahmawati', role: 'Marketing Executive' },
        { name: 'Nurmaidah', role: 'Marketing Executive' },
      ]
    },
    {
      category: 'Marketing Exclusive',
      members: [
        { name: 'Erni', role: 'Marketing Exclusive' },
        { name: 'Ayu Gery', role: 'Marketing Exclusive' },
      ]
    },
    {
      category: 'Marcomm & Admin',
      members: [
        { name: 'Nabila', role: 'Tim Marcomm' },
        { name: 'Novi', role: 'Admin Project Wotu' },
      ]
    },
    {
      category: 'Digital Marketing',
      members: [
        { name: 'Ibnu Hajar', role: 'Digital Marketing' },
        { name: 'Damar Mahendra', role: 'Digital Marketing' },
      ]
    }
  ];

  // Helper untuk membuat avatar inisial
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full bg-white pb-24">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-extrabold mb-6">
            Tim <span className="text-brand-primary">Keluarga Besar</span> Kami
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Orang-orang hebat di balik kesuksesan pengembangan properti syariah AFKAR LAND.
          </motion.p>
        </div>
      </section>

      {/* TEAM GRID BERDASARKAN KATEGORI */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          {teamCategories.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-20 last:mb-0">
              <motion.h2 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                className="text-3xl font-heading font-bold text-center mb-12 relative pb-4 inline-block left-1/2 -translate-x-1/2"
              >
                {group.category}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-primary rounded-full"></span>
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
                {group.members.map((member, memberIndex) => (
                  <motion.div 
                    key={memberIndex}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} transition={{ delay: memberIndex * 0.1 }}
                    className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group"
                  >
                    <div className="w-24 h-24 rounded-full bg-gray-100 text-brand-primary flex items-center justify-center text-2xl font-heading font-bold mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 border-4 border-white shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}