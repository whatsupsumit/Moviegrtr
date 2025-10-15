// Gemini AI API utility for generating movie spoilers and detailed stories

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * Generate a detailed spoiler story for a movie using Gemini AI
 * @param {Object} movieData - Movie data from TMDB
 * @returns {Promise<string>} - Generated spoiler content
 */
export const generateMovieSpoiler = async (movieData) => {
  if (!GEMINI_API_KEY) {
    console.warn('⚠️ Gemini API key not found, using fallback');
    return generateFallbackSpoiler(movieData);
  }

  const { title, release_date, overview, genres } = movieData;
  const year = release_date ? new Date(release_date).getFullYear() : 'Unknown';
  const genreNames = genres?.map(g => g.name).join(', ') || 'Unknown';

  const prompt = `Write a detailed story summary with FULL SPOILERS for the movie "${title}" (${year}).

Movie Overview: ${overview}
Genres: ${genreNames}

Please provide:
1. A comprehensive plot summary including ALL major spoilers
2. Character arcs and development
3. Key plot twists and revelations
4. The ending and resolution
5. Major themes and symbolism

Write in an engaging, narrative style. Include specific details about character motivations, plot twists, and the complete story arc from beginning to end. Make it detailed and informative for someone who wants to know the entire story without watching.

Format the response in clear paragraphs. Start with "⚠️ FULL SPOILERS AHEAD ⚠️" warning.`;

  const geminiEndpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  ];

  for (const endpoint of geminiEndpoints) {
    try {
      console.log('🤖 Generating spoiler with Gemini AI...');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        console.warn(`Gemini API failed with status ${response.status}, trying next endpoint...`);
        continue;
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const generatedText = data.candidates[0].content.parts[0].text;
        console.log('✅ Spoiler generated successfully!');
        return generatedText;
      }
    } catch (error) {
      console.warn('Gemini API error:', error.message);
      continue;
    }
  }

  console.log('🔄 All Gemini endpoints failed, using fallback');
  return generateFallbackSpoiler(movieData);
};

/**
 * Generate a fallback spoiler when Gemini API is unavailable
 */
const generateFallbackSpoiler = (movieData) => {
  const { title, overview, genres } = movieData;
  const genreNames = genres?.map(g => g.name).join(', ') || 'Various genres';

  return `⚠️ FULL SPOILERS AHEAD ⚠️

${overview || 'No overview available.'}

📖 Detailed Story Analysis

This ${genreNames.toLowerCase()} film "${title}" takes viewers on a compelling journey through its narrative. While we don't have AI-generated spoilers available at the moment, here's what we know:

The film explores its themes through carefully crafted character arcs and plot developments. The story builds tension through its pacing and reveals key information at strategic moments to maintain audience engagement.

🎬 Plot Development

The narrative structure follows classic storytelling conventions while adding unique twists that set this film apart. Characters face challenges that test their resolve and lead to significant character growth throughout the story.

⭐ Resolution

The film concludes by tying together the various plot threads established earlier, providing resolution to the central conflicts while potentially leaving some elements open for interpretation or continuation.

💡 Note: For a complete AI-generated spoiler analysis, please ensure your Gemini API key is configured in your environment variables (REACT_APP_GEMINI_API_KEY).`;
};

/**
 * Cache management for generated spoilers
 */
const SPOILER_CACHE_KEY = 'nexus_spoiler_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const getCachedSpoiler = (movieId) => {
  try {
    const cache = JSON.parse(localStorage.getItem(SPOILER_CACHE_KEY) || '{}');
    const cached = cache[movieId];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 Using cached spoiler');
      return cached.content;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading spoiler cache:', error);
    return null;
  }
};

export const cacheSpoiler = (movieId, content) => {
  try {
    const cache = JSON.parse(localStorage.getItem(SPOILER_CACHE_KEY) || '{}');
    cache[movieId] = {
      content,
      timestamp: Date.now()
    };
    
    // Keep only last 50 spoilers to prevent storage bloat
    const entries = Object.entries(cache);
    if (entries.length > 50) {
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      const trimmed = Object.fromEntries(entries.slice(0, 50));
      localStorage.setItem(SPOILER_CACHE_KEY, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(SPOILER_CACHE_KEY, JSON.stringify(cache));
    }
    
    console.log('💾 Spoiler cached successfully');
  } catch (error) {
    console.error('Error caching spoiler:', error);
  }
};
