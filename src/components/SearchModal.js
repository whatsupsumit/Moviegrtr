import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

const IMG = (path, size = 'w342') => 
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

// Debounce hook
function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('all'); // 'all', 'movie', 'tv'
  const inputRef = useRef(null);

  // ESC to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Auto-focus & reset on open/close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setResults([]);
      setError(null);
      setLoading(false);
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchResults = useCallback(async () => {
    const term = debouncedQuery.trim();
    if (!term) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = new URL('https://api.themoviedb.org/3/search/multi');
      url.searchParams.set('language', 'en-US');
      url.searchParams.set('include_adult', 'false');
      url.searchParams.set('query', term);
      
      if (!TMDB_ACCESS_TOKEN && TMDB_API_KEY) {
        url.searchParams.set('api_key', TMDB_API_KEY);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: TMDB_ACCESS_TOKEN
          ? { 
              Accept: 'application/json', 
              Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` 
            }
          : { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Search failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];
      
      // Filter by content type
      let filtered = rawResults.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );

      if (contentType !== 'all') {
        filtered = filtered.filter((item) => item.media_type === contentType);
      }

      setResults(filtered.slice(0, 20));
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, contentType]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleResultClick = (result) => {
    const path = result.media_type === 'movie' 
      ? `/movie/${result.id}` 
      : `/tv/${result.id}`;
    navigate(path, { state: { movie: result } });
    onClose();
  };

  const hasQuery = debouncedQuery.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Glow blobs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute left-1/2 top-24 -z-[0] h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute left-[15%] top-44 -z-[0] h-48 w-48 rounded-full bg-purple-500/15 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute right-[12%] top-60 -z-[0] h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="absolute left-1/2 top-24 w-[92%] max-w-3xl -translate-x-1/2 rounded-3xl bg-gray-900/90 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-2xl"
          >
            {/* Subtle edge gradients */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
            
            {/* Header */}
            <div className="relative z-10 space-y-3">
              {/* Search Input */}
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-3 rounded-2xl border border-red-500/30 bg-black/40 px-4 py-3 backdrop-blur-xl">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search movies and TV shows..."
                    className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none font-['JetBrains_Mono',monospace]"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-red-500/30 bg-black/40 px-4 py-3 text-sm text-white hover:bg-red-600/20 font-['JetBrains_Mono',monospace]"
                >
                  Close
                </button>
              </div>

              {/* Content Type Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setContentType('all')}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-['JetBrains_Mono',monospace] transition-all ${
                    contentType === 'all'
                      ? 'border-red-500 bg-red-600/20 text-white'
                      : 'border-white/10 bg-black/20 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  🎬 All
                </button>
                <button
                  onClick={() => setContentType('movie')}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-['JetBrains_Mono',monospace] transition-all ${
                    contentType === 'movie'
                      ? 'border-red-500 bg-red-600/20 text-white'
                      : 'border-white/10 bg-black/20 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  🎥 Movies
                </button>
                <button
                  onClick={() => setContentType('tv')}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-['JetBrains_Mono',monospace] transition-all ${
                    contentType === 'tv'
                      ? 'border-red-500 bg-red-600/20 text-white'
                      : 'border-white/10 bg-black/20 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  📺 TV Shows
                </button>
              </div>
            </div>

            {/* Results Body */}
            <div className="relative z-10 mt-4 max-h-[60vh] overflow-auto">
              {!hasQuery && (
                <div className="px-1 py-8 text-center">
                  <div className="mb-4 text-5xl">🔍</div>
                  <p className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">
                    Start typing to search movies and TV shows
                  </p>
                  <p className="mt-2 text-xs text-gray-500 font-['JetBrains_Mono',monospace]">
                    Try "Inception", "Breaking Bad", "The Matrix"...
                  </p>
                </div>
              )}

              {hasQuery && loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500/30 border-t-red-500"></div>
                  <p className="ml-3 text-sm text-gray-400 font-['JetBrains_Mono',monospace]">Searching...</p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
                  <p className="text-sm text-red-300 font-['JetBrains_Mono',monospace]">
                    ⚠️ Search error: {error}
                  </p>
                </div>
              )}

              {hasQuery && !loading && !error && results.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mb-4 text-5xl">🎭</div>
                  <p className="text-lg font-bold text-white font-['JetBrains_Mono',monospace] mb-2">
                    No Results Found
                  </p>
                  <p className="text-sm text-gray-400 font-['JetBrains_Mono',monospace]">
                    No {contentType === 'all' ? 'content' : contentType === 'movie' ? 'movies' : 'TV shows'} found for "{query}"
                  </p>
                  <p className="mt-2 text-xs text-gray-500 font-['JetBrains_Mono',monospace]">
                    Try different keywords or check spelling
                  </p>
                </div>
              )}

              {/* Results List */}
              <ul className="space-y-2">
                {results.map((result) => {
                  const poster = IMG(result.poster_path) || IMG(result.backdrop_path);
                  const title = result.media_type === 'movie' ? result.title : result.name;
                  const date = result.media_type === 'movie' ? result.release_date : result.first_air_date;
                  const year = date ? new Date(date).getFullYear() : '—';

                  return (
                    <motion.li
                      key={`${result.media_type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={() => handleResultClick(result)}
                        className="flex w-full gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition-all hover:bg-red-600/10 hover:border-red-500/30"
                      >
                        <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
                          {poster ? (
                            <img
                              src={poster}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">
                              {result.media_type === 'movie' ? '🎬' : '📺'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <div className="truncate text-sm font-bold text-white font-['JetBrains_Mono',monospace]">
                              {title}
                            </div>
                            <span className="flex-shrink-0 rounded-full bg-red-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300 border border-red-500/30">
                              {result.media_type}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 font-['JetBrains_Mono',monospace]">
                            <span>{year}</span>
                            {result.vote_average && (
                              <>
                                <span>•</span>
                                <span className="text-yellow-400">★ {result.vote_average.toFixed(1)}</span>
                              </>
                            )}
                          </div>
                          {result.overview && (
                            <p className="mt-2 line-clamp-2 text-xs text-gray-300 font-['JetBrains_Mono',monospace]">
                              {result.overview}
                            </p>
                          )}
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Footer Tip */}
            <div className="relative z-10 mt-3 text-center text-xs text-gray-500 font-['JetBrains_Mono',monospace]">
              Tip: Press <kbd className="rounded bg-white/10 px-2 py-0.5 border border-white/20">ESC</kbd> to close
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
