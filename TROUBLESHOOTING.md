# 🔍 TROUBLESHOOTING GUIDE - Movies Not Loading

## Quick Checks:

### 1. Are you logged in?
- The home page requires authentication
- If you see a login form, you need to sign in first
- Create an account using email/password or Google sign-in

### 2. Check Browser Console
Press **F12** and look at the Console tab for errors:

**Expected logs:**
- `[NEXUS] Firebase Analytics disabled to prevent GTM conflicts`
- API calls to `api.themoviedb.org`

**Error to look for:**
- Network errors (TMDB API down)
- Firebase authentication errors
- CORS errors

### 3. Check Network Tab
Press **F12** → **Network** tab:
- Filter by `api.themoviedb.org`
- You should see API calls with status 200
- If you see 401/403, check your API key

### 4. Verify API Keys
Check your `.env` file has:
```env
REACT_APP_TMDB_API_KEY="dc36900a16e14b924c96e065225b935b"
REACT_APP_TMDB_ACCESS_TOKEN="eyJhbGci..."
```

### 5. Clear Cache & Refresh
- Press **Ctrl + Shift + R** (hard refresh)
- Or **Ctrl + F5**
- This clears any cached errors

## Common Issues:

### Issue: "Blank home page after login"
**Solution:**
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check if TMDB API calls are failing
4. Wait 5-10 seconds for loading

### Issue: "Movies load but don't display"
**Solution:**
1. Check if scrolling down reveals content
2. Look for CSS rendering issues
3. Try a different browser (Chrome recommended)

### Issue: "API rate limit exceeded"
**Solution:**
- TMDB free tier: 40 requests per 10 seconds
- Wait a minute and refresh
- Cached data should load faster

### Issue: "Firebase errors"
**Solution:**
1. Check Firebase console: https://console.firebase.google.com/
2. Verify Firestore is enabled
3. Check authentication settings
4. Ensure `.env` has correct Firebase config

## Testing Steps:

1. **Test Login:**
   ```
   Navigate to http://localhost:3000
   Should see login page if not authenticated
   Create account or sign in
   ```

2. **Test Home Page:**
   ```
   After login, should redirect to /browse
   Wait 3-5 seconds for movies to load
   Should see multiple carousels:
   - Trending Movies
   - Popular Movies
   - Top Rated Movies
   - Trending TV Shows
   - etc.
   ```

3. **Test Navigation:**
   ```
   Click "MOVIES" in header
   Should load movies page
   Click "FOR YOU" for recommendations
   Click "GROUPS" for group features
   ```

## Manual API Test:

Open browser console and run:
```javascript
fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=dc36900a16e14b924c96e065225b935b')
  .then(r => r.json())
  .then(d => console.log('API working:', d.results.length, 'movies'))
  .catch(e => console.error('API error:', e))
```

## Quick Fixes:

### Fix 1: Restart Development Server
```bash
# Stop the server (Ctrl + C in terminal)
# Then restart:
npm start
```

### Fix 2: Clear All Storage
In browser console:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 3: Check if Server is Running
- Terminal should show: `webpack compiled with 2 warnings`
- Should see: `http://localhost:3000`
- If not, run `npm start` again

## Need Help?

### Check these in order:

1. ✅ Is the dev server running? (Look for webpack compiled message)
2. ✅ Can you access http://localhost:3000?
3. ✅ Are you logged in? (Not seeing login page)
4. ✅ Any red errors in browser console?
5. ✅ Any failed network requests in Network tab?

### Most Likely Causes:

**90% of the time it's one of these:**
1. Not logged in yet
2. Movies are loading but page is scrolled to top
3. Browser cache needs clearing
4. Waiting for API response (slow connection)

### Force Movie Load Test:

If home page is blank, try going directly to:
- http://localhost:3000/movies
- http://localhost:3000/tv-shows

If these work but home doesn't:
- Issue is with Browse component
- Check console for errors

## Still Not Working?

### Diagnostic Commands:

Check if API key is loaded:
```javascript
console.log(process.env.REACT_APP_TMDB_API_KEY)
// Should show: dc36900a16e14b924c96e065225b935b
```

Check if user is authenticated:
```javascript
console.log('User:', localStorage.getItem('user'))
```

Check Firebase:
```javascript
import { auth } from './utils/firebase';
console.log('Auth:', auth.currentUser);
```

---

## Expected Behavior:

**On Home Page (/browse):**
- Hero section at top
- Search bar
- Multiple horizontal carousels
- Each carousel has 10-20 movies/shows
- Smooth scrolling
- Click any movie to see details

**If everything is working:**
- Movies load within 2-3 seconds
- You can click and scroll through carousels
- Clicking a movie opens detail page
- Navigation works smoothly

---

**Status:** App compiled successfully at localhost:3000
**Warnings:** 2 (EmailJS not installed - expected)
**Errors:** 0
**Ready:** ✅ Yes

The app should be working! If movies still don't show, please:
1. Open browser console (F12)
2. Take a screenshot of any errors
3. Check the Network tab for failed requests
