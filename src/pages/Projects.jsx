import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';

// LOGIKA: Menampilkan daftar seluruh proyek perumahan
export default function Projects() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Data Proyek AFKAR LAND
  const projects = [
    { 
      slug: 'masagena-green-hills', 
      name: 'Masagena Green Hills', 
      location: 'Sulawesi Selatan',
      status: 'Tersedia',
      desc: 'Hunian asri bernuansa perbukitan hijau yang menenangkan, dirancang khusus untuk kenyamanan dan privasi keluarga Anda.', 
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' 
    },
    { 
      slug: 'wotu-islamic-village', 
      name: 'Wotu Islamic Village', 
      location: 'Luwu Timur, Sulawesi Selatan',
      status: 'Tersedia',
      desc: 'Kawasan islami terpadu pertama dengan fasilitas masjid agung dan lingkungan bertetangga yang menjunjung nilai syariah.', 
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80' 
    },
    { 
      slug: 'hasanah-panakkukang', 
      name: 'The Hasanah Panakkukang', 
      location: 'Makassar',
      status: 'Sisa Sedikit',
      desc: 'Kawasan strategis modern di jantung kota Makassar, memberikan akses mudah ke berbagai fasilitas publik terbaik.', 
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80' 
    },
    { 
      slug: 'afkar-madani-estate', 
      name: 'Afkar Madani Estate', 
      location: 'Sulawesi Selatan',
      status: 'Tersedia',
      desc: 'Perumahan premium dengan gerbang eksklusif, infrastruktur modern, dan sistem keamanan satu pintu 24 jam.', 
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' 
    }
  ];

  return (
    <div className="w-full bg-gray-50 pb-24">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-20 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-heading font-extrabold mb-6"
          >
            Proyek <span className="text-brand-primary">Eksklusif</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto font-light"
          >
            Pilih hunian syariah idaman Anda dari portofolio karya terbaik AFKAR LAND.
          </motion.p>
        </div>
      </section>

      {/* GRID PROYEK */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <motion.div 
                key={project.slug}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp} transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                    {project.status}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col grow">
                  <div className="flex items-center gap-2 text-brand-primary mb-3 text-sm font-bold tracking-wider uppercase">
                    <FiMapPin size={16} /> {project.location}
                  </div>
                  <h2 className="text-3xl font-heading font-bold text-black mb-4">{project.name}</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed grow">{project.desc}</p>
                  
                  <Link 
                    to={`/proyek/${project.slug}`} 
                    className="flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-colors duration-300 group/btn"
                  >
                    <span className="font-bold">Konsultasi Project Ini</span>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-colors">
                      <FiArrowRight />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}