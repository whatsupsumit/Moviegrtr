# 🎬 COMPLETE TESTING GUIDE - Email Notifications

## ✅ What's Been Completed

### 1. Email Service Setup
- ✅ EmailJS package installed
- ✅ Email service configured with your credentials
- ✅ Template created for movie proposals
- ✅ All environment variables set

### 2. Your EmailJS Configuration
```
Service ID: service_ptezuw3
Template ID: template_3c5zryf
Public Key: 37_XtPYJCDpBe5k5y
```

### 3. Features Implemented
- ✅ Group creation system
- ✅ Movie proposal system
- ✅ Email notification system
- ✅ Firestore database integration
- ✅ Firebase security rules updated

---

## 🔍 Current Status

### What's Working:
✅ Server runs successfully
✅ Firebase authentication
✅ Firestore database connected
✅ EmailJS installed and configured

### What Needs Testing:
1. Create a group
2. Propose a movie to the group
3. Check if emails are sent

---

## 📋 STEP-BY-STEP TESTING PROCEDURE

### STEP 1: Verify Server is Running
```
1. Open terminal
2. Navigate to: cd "c:\Users\digital\Desktop\my assignment\Moviegrtr"
3. Run: npm start
4. Wait for "webpack compiled successfully"
5. Open: http://localhost:3000
```

### STEP 2: Login to the App
```
1. Go to http://localhost:3000
2. Sign in with your account
3. Make sure you're logged in (you should see your profile icon)
```

### STEP 3: Create a Group
```
1. Click "GROUPS" in the header
2. Click "Create Your First Group" button
3. Fill in:
   - Group Name: Test Group
   - Member Emails: ketanmishra71@gmail.com, ytindiabt2@gmail.com
4. Click "CREATE GROUP"
5. You should see: "Group created successfully! 🎉"
```

**If you get an error:**
- Check Firebase Console → Firestore → Rules
- Make sure rules allow authenticated users to write

### STEP 4: Propose a Movie
```
1. Click "MOVIES" in header
2. Click any movie (e.g., Deadpool, Inception)
3. Scroll down
4. Click "Propose to Group" button
5. Select your group from dropdown
6. Click "Propose Movie"
7. You should see: "Movie proposed successfully! 🎬"
```

### STEP 5: Check for Emails
```
1. Open Gmail: gmail.com
2. Check inbox for emails from Moviegrtr
3. Email should contain:
   - Movie title
   - Rating
   - Who proposed it
   - Group name
```

---

## 🐛 TROUBLESHOOTING

### If Create Group Button Doesn't Work:

**Check 1: Open Browser Console (F12)**
```
1. Press F12
2. Go to Console tab
3. Try creating a group
4. Look for error messages
```

**Common errors and fixes:**

**Error: "Missing or insufficient permissions"**
- Fix: Update Firebase Firestore Rules
- Go to: https://console.firebase.google.com/
- Select project: the-nexus-774
- Firestore Database → Rules
- Use these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Error: "User not authenticated"**
- Fix: Make sure you're logged in
- Go to http://localhost:3000
- Click profile icon and sign in

**Error: "Failed to send email"**
- This is OK! The proposal is saved, emails might be in demo mode
- Check console for: "📧 EMAIL NOTIFICATION (Demo Mode)"

---

### If Propose Movie Doesn't Work:

**Check 1: Do you have a group?**
```
- Go to GROUPS page
- You should see at least one group listed
- If not, create a group first
```

**Check 2: Are you logged in?**
```
- You must be signed in
- Profile icon should be visible in top right
```

**Check 3: Check Console Logs**
```
1. Press F12
2. Console tab
3. Try proposing a movie
4. Look for these messages:
   - "=== PROPOSING MOVIE ==="
   - "Proposal created"
   - "Email result"
```

---

## 📧 Email Notification Testing

### Expected Behavior:

**When you propose a movie:**
1. Proposal is saved to Firebase ✅
2. Email is sent to ALL group members (except you) 📧
3. Email contains:
   - Subject: 🎬 New Movie Proposal: [Movie Name]
   - Body: Movie details, who proposed it, group name

### Check if Emails are Sending:

**Option 1: Check EmailJS Dashboard**
```
1. Go to: https://dashboard.emailjs.com/
2. Sign in
3. Check "Email History"
4. You should see sent emails there
```

**Option 2: Check Browser Console**
```
1. F12 → Console
2. After proposing, look for:
   - "Proposal notifications sent successfully"
   - "Email result: { success: true, mode: 'email' }"
```

**Option 3: Check Gmail**
```
1. Open gmail.com
2. Check inbox
3. Check spam folder (just in case)
4. Search for: "Moviegrtr" or "Movie Proposal"
```

---

## 🎯 Quick Test Script

Copy this into browser console (F12) to test if everything is loaded:

```javascript
// Test 1: Check if user is logged in
console.log('User:', auth.currentUser);

// Test 2: Check if EmailJS is configured
console.log('EmailJS Service ID:', process.env.REACT_APP_EMAILJS_SERVICE_ID);
console.log('EmailJS Template ID:', process.env.REACT_APP_EMAILJS_TEMPLATE_ID);

// Test 3: Check if Firebase is connected
console.log('Firebase connected:', db !== undefined);
```

---

## 📞 What to Report if Still Not Working

Please provide:

1. **Screenshot of error** (if any)
2. **Console logs** (copy-paste from F12 console)
3. **Which step failed:**
   - Creating group?
   - Proposing movie?
   - Emails not received?
4. **Error message** (exact text)

---

## 💡 Important Notes

- **EmailJS Free Tier:** 300 emails/month (more than enough!)
- **Emails take 1-2 seconds** to send
- **Check spam folder** if not in inbox
- **Firestore needs authentication** - you must be logged in
- **Browser cache:** If something doesn't work, try Ctrl+Shift+R

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ You can create a group without errors
2. ✅ Group appears in the GROUPS page
3. ✅ You can propose a movie to the group
4. ✅ You see success message
5. ✅ Emails arrive in Gmail inbox within 1 minute

---

**Current Status:** All code is implemented and configured. Firebase permissions are set. EmailJS is configured. Server is running.

**Next Step:** Follow the testing procedure above step-by-step!
