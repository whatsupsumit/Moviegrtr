import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserMovieHistory } from '../utils/userHistoryService';
import { getPersonalizedRecommendations } from '../utils/recommendationEngine';
import { fetchPopularMovies, fetchTrendingMovies } from '../utils/vidsrcApi';
import MovieCard from './MovieCard';

const Recommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      // Get user's viewing history
      const userHistory = await getUserMovieHistory();
      setHistoryCount(userHistory.length);

      // Get pool of movies to recommend from
      const [popular, trending] = await Promise.all([
        fetchPopularMovies(),
        fetchTrendingMovies()
      ]);

      const allMovies = [
        ...(popular.results || []),
        ...(trending.results || [])
      ];

      // Remove duplicates
      const uniqueMovies = Array.from(
        new Map(allMovies.map(m => [m.id, m])).values()
      );

      // Get personalized recommendations
      const recs = await getPersonalizedRecommendations(
        userHistory,
        uniqueMovies,
        20
      );

      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="font-['JetBrains_Mono',monospace] text-white text-lg">
            Generating personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['JetBrains_Mono',monospace] text-4xl font-bold mb-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Your Personalized Recommendations
          </h1>
          <p className="text-gray-400">
            {historyCount > 0 
              ? `Based on your ${historyCount} previously viewed movies` 
              : 'Popular movies you might enjoy'}
          </p>
        </div>

        {/* Info Banner */}
        {historyCount === 0 && (
          <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-['JetBrains_Mono',monospace] font-semibold mb-1">
                  Start watching to get personalized recommendations!
                </h3>
                <p className="text-sm text-gray-400">
                  As you browse and watch movies, we'll learn your preferences and suggest movies you'll love.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Grid */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((movie) => (
              <div key={movie.id} className="group relative">
                <div 
                  onClick={() => handleMovieClick(movie.id)}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <MovieCard movie={movie} />
                </div>
                
                {/* Recommendation Score Badge */}
                {movie.similarityScore && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {Math.round(movie.similarityScore * 100)}% Match
                  </div>
                )}
                
                {/* Recommendation Reason */}
                {movie.recommendationReason && (
                  <div className="mt-2 text-xs text-gray-400 font-['JetBrains_Mono',monospace]">
                    {movie.recommendationReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="font-['JetBrains_Mono',monospace] text-xl mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start exploring movies to get personalized suggestions
            </p>
            <button
              onClick={() => navigate('/movies')}
              className="bg-red-500 hover:bg-red-600 text-white font-['JetBrains_Mono',monospace] px-6 py-3 rounded-lg transition-colors"
            >
              Browse Movies
            </button>
          </div>
        )}

        {/* Refresh Button */}
        {recommendations.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadRecommendations}
              className="bg-gray-800 hover:bg-gray-700 text-white font-['JetBrains_Mono',monospace] px-6 py-3 rounded-lg transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
