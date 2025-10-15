// Movie Recommendation Engine using Content-Based Filtering
import { fetchMovieDetails, searchMovies } from './vidsrcApi';

/**
 * Calculate similarity score between two movies based on genres, keywords, and overview
 * @param {Object} movie1 - First movie object
 * @param {Object} movie2 - Second movie object
 * @returns {number} - Similarity score between 0 and 1
 */
export const calculateMovieSimilarity = (movie1, movie2) => {
  let score = 0;
  let weights = 0;

  // Genre similarity (weight: 0.4)
  if (movie1.genres && movie2.genres) {
    const genres1 = movie1.genres.map(g => g.id || g);
    const genres2 = movie2.genres.map(g => g.id || g);
    const genreIntersection = genres1.filter(g => genres2.includes(g)).length;
    const genreUnion = new Set([...genres1, ...genres2]).size;
    
    if (genreUnion > 0) {
      score += (genreIntersection / genreUnion) * 0.4;
      weights += 0.4;
    }
  }

  // Text similarity based on overview (weight: 0.3)
  if (movie1.overview && movie2.overview) {
    const overview1Words = movie1.overview.toLowerCase().split(/\s+/);
    const overview2Words = movie2.overview.toLowerCase().split(/\s+/);
    const commonWords = overview1Words.filter(word => 
      word.length > 3 && overview2Words.includes(word)
    ).length;
    const totalWords = new Set([...overview1Words, ...overview2Words]).size;
    
    if (totalWords > 0) {
      score += (commonWords / totalWords) * 0.3;
      weights += 0.3;
    }
  }

  // Rating similarity (weight: 0.2)
  if (movie1.vote_average && movie2.vote_average) {
    const ratingDiff = Math.abs(movie1.vote_average - movie2.vote_average);
    const ratingSimilarity = 1 - (ratingDiff / 10);
    score += ratingSimilarity * 0.2;
    weights += 0.2;
  }

  // Popularity similarity (weight: 0.1)
  if (movie1.popularity && movie2.popularity) {
    const maxPop = Math.max(movie1.popularity, movie2.popularity);
    const minPop = Math.min(movie1.popularity, movie2.popularity);
    const popSimilarity = maxPop > 0 ? minPop / maxPop : 0;
    score += popSimilarity * 0.1;
    weights += 0.1;
  }

  return weights > 0 ? score / weights : 0;
};

/**
 * Get movie recommendations based on user's search/watch history
 * @param {Array} historyMovies - Array of movie IDs or objects from user history
 * @param {Array} candidateMovies - Array of candidate movies to compare against
 * @param {number} topN - Number of recommendations to return
 * @returns {Array} - Array of recommended movies with similarity scores
 */
export const getRecommendations = async (historyMovies, candidateMovies, topN = 10) => {
  try {
    // Ensure history movies have full details
    const detailedHistory = await Promise.all(
      historyMovies.map(async (movie) => {
        if (typeof movie === 'number' || (typeof movie === 'object' && !movie.genres)) {
          const id = typeof movie === 'number' ? movie : movie.id;
          return await fetchMovieDetails(id);
        }
        return movie;
      })
    );

    // Calculate similarity scores for each candidate movie
    const scoredMovies = candidateMovies.map(candidate => {
      // Calculate average similarity with all history movies
      const similarities = detailedHistory.map(historyMovie => 
        calculateMovieSimilarity(historyMovie, candidate)
      );
      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
      
      return {
        ...candidate,
        similarityScore: avgSimilarity,
        recommendationReason: generateRecommendationReason(candidate, detailedHistory)
      };
    });

    // Sort by similarity score and return top N
    return scoredMovies
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topN);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return [];
  }
};

/**
 * Generate a human-readable reason for the recommendation
 * @param {Object} movie - Recommended movie
 * @param {Array} historyMovies - User's history movies
 * @returns {string} - Recommendation reason
 */
const generateRecommendationReason = (movie, historyMovies) => {
  const reasons = [];
  
  // Find common genres
  const movieGenres = movie.genres?.map(g => g.name || g) || [];
  const historyGenres = historyMovies.flatMap(m => 
    m.genres?.map(g => g.name || g) || []
  );
  const commonGenres = movieGenres.filter(g => historyGenres.includes(g));
  
  if (commonGenres.length > 0) {
    reasons.push(`Similar genres: ${commonGenres.slice(0, 2).join(', ')}`);
  }
  
  // Check rating
  if (movie.vote_average >= 7) {
    reasons.push('Highly rated');
  }
  
  // Check popularity
  if (movie.popularity > 100) {
    reasons.push('Trending now');
  }
  
  return reasons.length > 0 ? reasons.join(' • ') : 'Based on your preferences';
};

/**
 * Get personalized recommendations based on user's viewing history
 * @param {Array} userHistory - Array of movie IDs from user's history
 * @param {Array} allMovies - Pool of movies to recommend from
 * @param {number} limit - Number of recommendations
 * @returns {Array} - Personalized movie recommendations
 */
export const getPersonalizedRecommendations = async (userHistory, allMovies, limit = 20) => {
  if (!userHistory || userHistory.length === 0) {
    // Return popular movies if no history
    return allMovies.slice(0, limit);
  }

  // Filter out movies already in history
  const historyIds = new Set(userHistory.map(m => typeof m === 'number' ? m : m.id));
  const candidateMovies = allMovies.filter(m => !historyIds.has(m.id));

  // Get recommendations
  return await getRecommendations(userHistory, candidateMovies, limit);
};

/**
 * Find similar movies based on a single movie
 * @param {number} movieId - The movie ID to find similar movies for
 * @param {Array} allMovies - Pool of movies to search
 * @param {number} limit - Number of similar movies to return
 * @returns {Array} - Similar movies
 */
export const getSimilarMovies = async (movieId, allMovies, limit = 10) => {
  try {
    const baseMovie = await fetchMovieDetails(movieId);
    const candidateMovies = allMovies.filter(m => m.id !== movieId);
    
    return await getRecommendations([baseMovie], candidateMovies, limit);
  } catch (error) {
    console.error('Error finding similar movies:', error);
    return [];
  }
};
