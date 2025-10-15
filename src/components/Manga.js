import React from 'react';
import { motion } from 'framer-motion';

const Manga = () => {
  return (
    <div className="min-h-screen pt-8 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent font-['JetBrains_Mono',monospace] mb-4">
            <span className="text-red-400">{'>'}</span> MANGA LIBRARY
          </h1>
          <p className="text-gray-400 font-['JetBrains_Mono',monospace] text-sm sm:text-base">
            Your gateway to the world of manga • Coming Soon
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-['JetBrains_Mono',monospace]">
                Manga Reader
              </h2>
            </div>
            <p className="text-gray-300 font-['JetBrains_Mono',monospace] text-sm leading-relaxed">
              Browse and read your favorite manga series with our upcoming manga reader feature. 
              Experience high-quality scans with smooth page transitions.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-['JetBrains_Mono',monospace] text-xs font-bold">
                IN DEVELOPMENT
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-['JetBrains_Mono',monospace]">
                Features
              </h2>
            </div>
            <ul className="space-y-3 text-gray-300 font-['JetBrains_Mono',monospace] text-sm">
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">▹</span>
                <span>Browse popular and trending manga series</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">▹</span>
                <span>Search by title, genre, or author</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">▹</span>
                <span>Bookmark and track your reading progress</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">▹</span>
                <span>Smooth page-by-page reading experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 mt-1">▹</span>
                <span>Multiple reading modes (LTR/RTL)</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-sm border border-red-800/30 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-['JetBrains_Mono',monospace] text-xs font-bold">
                MANGA MODULE: INITIALIZING
              </span>
            </div>
            <span className="text-gray-600">●</span>
            <span className="text-gray-400 font-['JetBrains_Mono',monospace] text-xs">
              ETA: Q4 2025
            </span>
          </div>
        </motion.div>

        {/* Placeholder Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-red-800/20 flex items-center justify-center group hover:border-red-600/50 transition-all duration-300"
            >
              <svg className="w-8 h-8 text-gray-700 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Manga;
