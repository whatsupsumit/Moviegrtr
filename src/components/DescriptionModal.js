import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DescriptionModal = ({ isOpen, onClose, title, overview, fullDescription, posterPath, rating, releaseDate, genres = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState(overview || '');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsExpanded(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && fullDescription) {
      setDescription(fullDescription);
    } else {
      setDescription(overview || '');
    }
  };

  // Truncate text for preview
  const shortDescription = overview?.length > 200 
    ? overview.substring(0, 200) + '...' 
    : overview;

  const hasMoreContent = fullDescription && fullDescription !== overview && fullDescription.length > overview?.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative max-w-4xl w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass Card */}
              <div className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl border border-red-500/20 shadow-2xl overflow-hidden">
                
                {/* Header with Backdrop */}
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  {posterPath && (
                    <>
                      <img
                        src={posterPath.startsWith('http') ? posterPath : `https://image.tmdb.org/t/p/original${posterPath}`}
                        alt={title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    </>
                  )}
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600/80 transition-colors border border-white/10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-2 font-['JetBrains_Mono',monospace]"
                    >
                      {title}
                    </motion.h2>
                    
                    {/* Metadata */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap items-center gap-3 text-sm"
                    >
                      {rating && (
                        <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm px-2 py-1 rounded-full border border-yellow-500/30">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-yellow-400 font-bold">{rating}</span>
                        </div>
                      )}
                      {releaseDate && (
                        <div className="bg-gray-700/40 backdrop-blur-sm px-3 py-1 rounded-full text-gray-300 border border-gray-600/30">
                          {releaseDate}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  {/* Genres */}
                  {genres.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mb-6"
                    >
                      {genres.slice(0, 4).map((genre, index) => (
                        <span
                          key={genre.id || index}
                          className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-300 rounded-full text-xs font-['JetBrains_Mono',monospace]"
                        >
                          {genre.name || genre}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* Description Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-red-400 font-['JetBrains_Mono',monospace]">
                        SYNOPSIS
                      </h3>
                    </div>

                    {/* Description Text */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isExpanded ? 'full' : 'short'}
                        initial={{ opacity: 0, height: 'auto' }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-4 font-['JetBrains_Mono',monospace]">
                          {isExpanded ? (fullDescription || overview) : shortDescription}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    {/* Read More/Less Button */}
                    {hasMoreContent && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleExpand}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-['JetBrains_Mono',monospace] font-bold text-sm group"
                      >
                        <span>{isExpanded ? 'READ LESS' : 'READ MORE'}</span>
                        <motion.svg
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-4 h-4 group-hover:translate-y-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Decorative Divider */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent my-6"
                  />

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-3"
                  >
                    <button
                      onClick={onClose}
                      className="flex-1 min-w-[120px] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-['JetBrains_Mono',monospace] font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      GOT IT
                    </button>
                  </motion.div>
                </div>

                {/* Animated Border Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-red-500/0 via-red-500/30 to-red-500/0 bg-[length:200%_100%] animate-shimmer" />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DescriptionModal;
