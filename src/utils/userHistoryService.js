// User History Tracking Service using Firebase Firestore
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Track a movie view/search by the user
 * @param {Object} movie - Movie object to track
 * @param {string} actionType - Type of action ('view', 'search', 'watchlist')
 */
export const trackMovieInteraction = async (movie, actionType = 'view') => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userHistoryRef = doc(db, 'userHistory', user.uid);
    const interaction = {
      movieId: movie.id,
      title: movie.title || movie.name,
      posterPath: movie.poster_path,
      genres: movie.genres || movie.genre_ids || [],
      rating: movie.vote_average,
      actionType,
      timestamp: Date.now()
    };

    // Get existing history
    const historyDoc = await getDoc(userHistoryRef);
    
    if (historyDoc.exists()) {
      // Update existing history
      await updateDoc(userHistoryRef, {
        interactions: arrayUnion(interaction),
        lastUpdated: serverTimestamp()
      });
    } else {
      // Create new history document
      await setDoc(userHistoryRef, {
        userId: user.uid,
        email: user.email,
        interactions: [interaction],
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    }

    console.log('Movie interaction tracked:', interaction);
  } catch (error) {
    console.error('Error tracking movie interaction:', error);
  }
};

/**
 * Get user's interaction history
 * @returns {Array} - Array of movie interactions
 */
export const getUserHistory = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const userHistoryRef = doc(db, 'userHistory', user.uid);
    const historyDoc = await getDoc(userHistoryRef);

    if (historyDoc.exists()) {
      return historyDoc.data().interactions || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user history:', error);
    return [];
  }
};

/**
 * Get unique movies from user history (for recommendations)
 * @returns {Array} - Array of unique movie IDs
 */
export const getUserMovieHistory = async () => {
  try {
    const history = await getUserHistory();
    const uniqueMovies = new Map();

    history.forEach(interaction => {
      if (!uniqueMovies.has(interaction.movieId)) {
        uniqueMovies.set(interaction.movieId, {
          id: interaction.movieId,
          title: interaction.title,
          poster_path: interaction.posterPath,
          genres: interaction.genres,
          vote_average: interaction.rating,
          lastViewed: interaction.timestamp
        });
      }
    });

    return Array.from(uniqueMovies.values());
  } catch (error) {
    console.error('Error getting user movie history:', error);
    return [];
  }
};

/**
 * Clear user history
 */
export const clearUserHistory = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userHistoryRef = doc(db, 'userHistory', user.uid);
    await updateDoc(userHistoryRef, {
      interactions: [],
      lastUpdated: serverTimestamp()
    });

    console.log('User history cleared');
  } catch (error) {
    console.error('Error clearing user history:', error);
  }
};
