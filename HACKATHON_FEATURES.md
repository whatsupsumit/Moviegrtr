# 🎬 Moviegrtr - Hackathon Features Implementation

## 🚀 New Features Added

This document outlines the **movie recommendation system with social features** that have been implemented for the hackathon.

---

## ✨ Features Implemented

### 1. **Personalized Movie Recommendations** 🎯
- **Content-based filtering algorithm** that analyzes movie similarities
- **User viewing history tracking** using Firebase Firestore
- **Smart recommendations** based on:
  - Genre matching (40% weight)
  - Overview text similarity (30% weight)
  - Rating similarity (20% weight)
  - Popularity matching (10% weight)
- **Real-time recommendation updates** as users watch movies

### 2. **Group Movie Watching System** 👥
- **Create movie groups** and invite friends via email
- **Propose movies** to your groups from any movie detail page
- **Vote on proposals** with yes/no responses
- **Track group activity** and member participation
- **View all your groups** and proposals in one place

### 3. **Email Notification System** 📧
- **Proposal notifications**: Members receive emails when movies are proposed
- **Decision notifications**: Get notified when others respond "yes"
- **EmailJS integration** (free tier available)
- **Fallback demo mode** if email service not configured

---

## 🗂️ File Structure

### New Files Created:

```
src/
├── components/
│   ├── Recommendations.js     # Personalized recommendations page
│   └── Groups.js              # Group management & voting interface
│
└── utils/
    ├── recommendationEngine.js    # Content-based filtering algorithm
    ├── userHistoryService.js     # Track user viewing history
    ├── groupService.js           # Group & proposal management
    └── emailService.js           # Email notification system
```

### Modified Files:

```
src/
├── components/
│   ├── MovieDetails.js    # Added "Propose to Group" button
│   ├── header.js          # Added navigation for new pages
│   └── Body.js            # Added routes for new pages
│
└── .env                   # Add email service credentials
```

---

## 🔧 Setup Instructions

### 1. Email Notifications (Optional but Recommended)

To enable email notifications:

**Option A: Using EmailJS (Free & Easy)**
1. Sign up at https://www.emailjs.com/
2. Create an email service (Gmail, Outlook, etc.)
3. Create two email templates:
   - **Proposal Template**: For when movies are proposed
   - **Response Template**: For when members respond
4. Add to your `.env`:
```env
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_PROPOSAL_TEMPLATE=proposal_template_id
REACT_APP_EMAILJS_RESPONSE_TEMPLATE=response_template_id
```
5. Install EmailJS:
```bash
npm install @emailjs/browser
```

**Option B: No Email Setup**
- The app works without email setup
- Notifications will be logged to console (demo mode)
- All other features work perfectly

### 2. Firebase Firestore Setup

Your Firebase project should already have Firestore enabled. The app will automatically create these collections:

- **`userHistory`**: Stores user viewing history
  - Document ID: User UID
  - Fields: interactions (array), userId, email, timestamps

- **`groups`**: Stores movie groups
  - Document ID: Auto-generated
  - Fields: name, createdBy, members, invitedEmails, timestamps

- **`movieProposals`**: Stores movie proposals to groups
  - Document ID: Auto-generated
  - Fields: movieId, groupId, proposedBy, responses, yesCount, noCount, status

---

## 🎮 How to Use

### For Users:

#### **1. Get Personalized Recommendations**
1. Navigate to **"FOR YOU"** in the header menu
2. Browse your personalized recommendations
3. Recommendations improve as you watch more movies
4. Click any movie to view details

#### **2. Create a Group**
1. Go to **"GROUPS"** in the header menu
2. Click **"Create Group"** button
3. Enter group name and member emails (comma-separated)
4. Click **"Create Group"**

#### **3. Propose a Movie to Your Group**
1. Browse movies and open any movie detail page
2. Click **"PROPOSE TO GROUP"** button (blue button)
3. Select which group to propose to
4. Click **"Propose Movie"**
5. All group members will receive email notifications (if configured)

#### **4. Vote on Movie Proposals**
1. Go to **"GROUPS"** page
2. Click **"Movie Proposals"** tab
3. View all proposals from your groups
4. Click **"Accept"** or **"Decline"** on any proposal
5. See voting statistics in real-time
6. When you vote "yes", the proposer gets notified

---

## 🧪 Testing the Features

### Test Scenario 1: Recommendations
1. **Browse movies** and click on several movie detail pages
2. Your viewing history is automatically tracked
3. Go to **"FOR YOU"** page to see personalized recommendations
4. Recommendations show similarity scores (e.g., "85% Match")
5. Each recommendation includes a reason (e.g., "Similar genres: Action, Sci-Fi")

### Test Scenario 2: Group Movie Selection
1. **Create a group** with test email addresses
2. **Browse to a movie** you like
3. **Propose it to your group** using the blue button
4. Check email inbox for notification (if configured)
5. As another group member, **vote "yes"** on the proposal
6. Original proposer receives notification of acceptance

### Test Scenario 3: Multiple Groups
1. Create multiple groups with different members
2. Propose different movies to different groups
3. View all proposals in one place
4. Track voting across all your groups

---

## 📊 Database Collections

### `userHistory` Collection
```javascript
{
  userId: "user123",
  email: "user@example.com",
  interactions: [
    {
      movieId: 550,
      title: "Fight Club",
      posterPath: "/path.jpg",
      genres: [18, 53],
      rating: 8.4,
      actionType: "view",
      timestamp: 1697385600000
    }
  ],
  createdAt: Timestamp,
  lastUpdated: Timestamp
}
```

### `groups` Collection
```javascript
{
  groupId: "group_123",
  name: "Friday Night Movies",
  createdBy: "user123",
  createdByEmail: "user@example.com",
  members: [
    {
      uid: "user123",
      email: "user@example.com",
      displayName: "John Doe",
      role: "admin",
      joinedAt: 1697385600000
    }
  ],
  invitedEmails: ["friend@example.com"],
  createdAt: Timestamp,
  lastActivity: Timestamp
}
```

### `movieProposals` Collection
```javascript
{
  proposalId: "proposal_456",
  groupId: "group_123",
  movieId: 550,
  movieTitle: "Fight Club",
  moviePoster: "/path.jpg",
  movieOverview: "An insomniac...",
  movieRating: 8.4,
  proposedBy: "user123",
  proposedByEmail: "user@example.com",
  proposedByName: "John Doe",
  responses: [
    {
      uid: "user456",
      email: "friend@example.com",
      displayName: "Jane Smith",
      response: true,
      respondedAt: 1697385600000
    }
  ],
  yesCount: 1,
  noCount: 0,
  status: "pending",
  createdAt: Timestamp
}
```

---

## 🎨 UI Components

### Recommendations Page
- **Grid layout** of recommended movies
- **Match percentage badges** (e.g., "85% Match")
- **Recommendation reasons** below each movie
- **Responsive design** for all screen sizes
- **Refresh button** to update recommendations

### Groups Page
- **Two tabs**: "My Groups" and "Movie Proposals"
- **Group cards** showing member count and creator
- **Proposal cards** with movie poster, details, and voting buttons
- **Create group modal** with form validation
- **Real-time voting statistics** (yes/no counts)

### Movie Details Enhancement
- **"Propose to Group" button** alongside existing actions
- **Group selection modal** when proposing
- **Visual feedback** for successful proposals

---

## 🔐 Security & Privacy

- ✅ **Firebase Firestore security rules** protect user data
- ✅ **Email validation** for group invitations
- ✅ **User authentication required** for all features
- ✅ **Only group members** can view proposals
- ✅ **Unique IDs** for groups and proposals prevent collisions

---

## 🚀 Performance Optimizations

- **Parallel data loading** for faster page loads
- **Efficient Firebase queries** with proper indexing
- **Memoized calculations** for recommendation scores
- **Lazy loading** of movie data
- **Optimistic UI updates** for instant feedback

---

## 📱 Responsive Design

All new features are **fully responsive**:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktop (1024px+)
- ✅ Large screens (1920px+)

---

## 🎯 Hackathon Implementation Summary

### ✅ Phase 1: Recommendation Engine
- [x] Content-based filtering algorithm
- [x] TF-IDF-inspired similarity calculation
- [x] Cosine similarity between movie features
- [x] User history tracking

### ✅ Phase 2: Group Management
- [x] Group creation and member management
- [x] Movie proposal system
- [x] Voting mechanism (yes/no)
- [x] Real-time proposal tracking

### ✅ Phase 3: Email Notifications
- [x] EmailJS integration
- [x] Proposal notification emails
- [x] Response notification emails
- [x] Graceful fallback without email

---

## 🎓 Key Technologies Used

- **React 19** - UI framework
- **Firebase Firestore** - Real-time database
- **EmailJS** - Email notifications
- **TMDB API** - Movie data
- **TailwindCSS** - Styling
- **React Router** - Navigation

---

## 📝 Next Steps (Future Enhancements)

- [ ] Add recommendation algorithm variations (collaborative filtering)
- [ ] Implement group chat for movie discussions
- [ ] Add calendar integration for movie night scheduling
- [ ] Create watch party feature with synchronized playback
- [ ] Add movie ratings and reviews from group members
- [ ] Implement push notifications (web notifications API)
- [ ] Add analytics dashboard for group activity

---

## 🆘 Troubleshooting

### Recommendations not showing?
- Browse and click on some movies first to build history
- Check browser console for errors
- Verify Firebase is properly initialized

### Email notifications not working?
- Verify EmailJS credentials in `.env`
- Install `@emailjs/browser` package
- Check EmailJS dashboard for quota limits
- The app works without email (demo mode)

### Groups not loading?
- Check Firebase Firestore is enabled
- Verify authentication is working
- Check browser console for errors
- Ensure Firestore security rules allow read/write

---

## 👨‍💻 Development Time

**Total implementation time: ~3 hours**
- Recommendation engine: 45 min
- Group system: 60 min
- Email notifications: 30 min
- UI components: 45 min

---

## 🏆 Demo Tips for Judges

1. **Show the recommendation evolution**: Browse movies → Check recommendations → Browse more → See updated recommendations
2. **Demonstrate group workflow**: Create group → Propose movie → Switch accounts → Vote → Show notifications
3. **Highlight the algorithm**: Show how similar movies are recommended based on genres and ratings
4. **Mobile responsiveness**: Demo on different screen sizes
5. **Real-time updates**: Show how votes update instantly

---

## 📧 Contact & Support

For questions or issues:
- Check browser console for detailed error messages
- Review Firebase Console for database issues
- Test with demo mode (no email) first
- Verify all environment variables are set

---

**Built with ❤️ for the hackathon**

Good luck! 🎉
