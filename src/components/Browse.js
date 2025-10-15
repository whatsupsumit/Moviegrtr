import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchTrendingMoviesCached,
  fetchPopularMoviesCached,
  fetchTrendingTVShowsCached,
  fetchPopularTVShowsCached,
  fetchTopRatedMovies,
  fetchTopRatedTVShows
} from '../utils/vidsrcApi';
import ContentCarousel from './ContentCarousel';
import VideoPlayer from './VideoPlayer';
import ContinueWatching from './ContinueWatching';

const Browse = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Content state
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  // Player state
  const [selectedContent, setSelectedContent] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isTV, setIsTV] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Load initial content with simple caching
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        // Load movies
        const [trendingMoviesData, popularMoviesData, topRatedMoviesData] = await Promise.all([
          fetchTrendingMoviesCached(),
          fetchPopularMoviesCached(),
          fetchTopRatedMovies()
        ]);
        
        const trendingResults = trendingMoviesData.results || [];
        setTrendingMovies(trendingResults);
        setPopularMovies(popularMoviesData.results || []);
        setTopRatedMovies(topRatedMoviesData.results || []);
        
        // Load TV shows
        const [trendingTVData, popularTVData, topRatedTVData] = await Promise.all([
          fetchTrendingTVShowsCached(),
          fetchPopularTVShowsCached(),
          fetchTopRatedTVShows()
        ]);
        
        setTrendingTV(trendingTVData.results || []);
        setPopularTV(popularTVData.results || []);
        setTopRatedTV(topRatedTVData.results || []);
        
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const handleContentClick = (content, isTV = null) => {
    const contentIsTV = isTV !== null ? isTV : (content.media_type === 'tv' || content.first_air_date !== undefined);
    
    if (contentIsTV) {
      navigate(`/tv/${content.id}`, { state: { movie: content } });
    } else {
      navigate(`/movie/${content.id}`, { state: { movie: content } });
    }
  };

  const closePlayer = () => {
    setShowPlayer(false);
    setSelectedContent(null);
    setIsTV(false);
  };

  const handleContentSelect = (content, contentIsTV) => {
    setSelectedContent(content);
    setIsTV(contentIsTV);
  };

  if (showPlayer && selectedContent) {
    return (
      <VideoPlayer
        movie={selectedContent}
        isTV={isTV}
        season={selectedContent.startSeason || 1}
        episode={selectedContent.startEpisode || 1}
        onClose={closePlayer}
        onContentSelect={handleContentSelect}
      />
    );
  }

  return (
    <div className="relative min-h-screen text-nexus-text overflow-hidden bg-black">
      {/* Content Sections - Starting from top with proper spacing to avoid header overlap */}
      <div className={`relative z-40 px-4 sm:px-6 md:px-8 space-y-6 sm:space-y-8 pt-24 sm:pt-28 md:pt-32 pb-8 transition-all duration-1000 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Continue Watching Section */}
          <div>
            <ContinueWatching onMovieClick={handleContentClick} />
          </div>
          
          {/* Trending Movies */}
          <div>
            <ContentCarousel
              title="TRENDING MOVIES"
              content={trendingMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Trending TV Shows */}
          <div>
            <ContentCarousel
              title="TRENDING TV SHOWS"
              content={trendingTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

          {/* Popular Movies */}
          <div>
            <ContentCarousel
              title="POPULAR MOVIES"
              content={popularMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Popular TV Shows */}
          <div>
            <ContentCarousel
              title="POPULAR TV SHOWS"
              content={popularTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

          {/* Top Rated Movies */}
          <div>
            <ContentCarousel
              title="TOP RATED MOVIES"
              content={topRatedMovies}
              onItemClick={handleContentClick}
              isTV={false}
              loading={loading}
            />
          </div>

          {/* Top Rated TV Shows */}
          <div>
            <ContentCarousel
              title="TOP RATED TV SHOWS"
              content={topRatedTV}
              onItemClick={handleContentClick}
              isTV={true}
              loading={loading}
            />
          </div>

        {/* Footer with system status */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center pb-12 sm:pb-16">
          <div className="font-['Arvo',serif] text-xs sm:text-sm text-gray-400 space-y-2">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>SYSTEM STATUS: ONLINE</span>
              </div>
              <span className="hidden sm:inline text-green-400">●</span>
              <span className="hidden sm:inline">STREAMING: STABLE</span>
              <span className="hidden sm:inline text-red-400">●</span>
              <span className="hidden sm:inline">PLATFORM: SYNCHRONIZED</span>
            </div>
            <div className="text-xs text-gray-500">
              Moviegrtr v2.1.0 | Entertainment Platform Active | VidSrc Integration Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
