# 📧 Email Notification Troubleshooting Guide

## Quick Test

### Method 1: Standalone Test Page
1. Open your browser to: `http://localhost:3000/email-test.html`
2. Click "Run Configuration Test"
3. Enter your email address
4. Click "Send Test Email"
5. Check your inbox (and spam folder!)

### Method 2: Browser Console Test
1. Open your app: `http://localhost:3000`
2. Open browser console (F12)
3. Paste and run:
```javascript
import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js').then(emailjs => {
  emailjs.default.init('37_XtPYJCDpBe5k5y');
  
  return emailjs.default.send(
    'service_ptezuw3',
    'template_3c5zryf',
    {
      to_email: 'YOUR_EMAIL@gmail.com', // CHANGE THIS
      to_name: 'Test User',
      from_name: 'Console Test',
      group_name: 'Test Group',
      movie_title: 'The Matrix',
      movie_overview: 'Test email from browser console',
      movie_rating: '8.7'
    }
  );
}).then(result => {
  console.log('✅ Email sent!', result);
  alert('Email sent! Check your inbox');
}).catch(error => {
  console.error('❌ Error:', error);
  alert('Error: ' + error.text);
});
```

## Common Issues & Solutions

### Issue 1: "EmailJS not installed" in console
**Symptoms:** Console shows "EmailJS not installed. Email notifications disabled."

**Solution:**
```bash
cd "c:\Users\digital\Desktop\my assignment\Moviegrtr"
npm install @emailjs/browser
npm start
```

### Issue 2: Email not sending (no error)
**Symptoms:** Proposal succeeds but no email arrives

**Check:**
1. **Browser Console** - Open F12 and look for email logs
2. **EmailJS Dashboard** - Log in to https://dashboard.emailjs.com/
   - Go to "Email History"
   - Check if emails are showing as sent
3. **Spam Folder** - Check recipient's spam/junk folder
4. **Email Quota** - Free EmailJS has 200 emails/month limit

### Issue 3: Template error
**Symptoms:** Error: "template not found" or similar

**Solution:**
1. Log in to https://dashboard.emailjs.com/
2. Go to "Email Templates"
3. Verify template ID is: `template_3c5zryf`
4. Check template variables match:
   - `{{to_email}}`
   - `{{to_name}}`
   - `{{from_name}}`
   - `{{group_name}}`
   - `{{movie_title}}`
   - `{{movie_overview}}`
   - `{{movie_rating}}`

### Issue 4: Public key error
**Symptoms:** Error about invalid public key

**Solution:**
1. Check `.env` file has:
```
REACT_APP_EMAILJS_PUBLIC_KEY="37_XtPYJCDpBe5k5y"
```
2. Restart server: `Ctrl+C` then `npm start`
3. Hard refresh browser: `Ctrl+Shift+R`

### Issue 5: Group has no members
**Symptoms:** Alert says "This group has no members!"

**Solution:**
1. When creating a group, add member emails
2. Group creator is automatically added
3. Check Firebase console: https://console.firebase.google.com/
   - Project: the-nexus-774
   - Firestore Database > groups
   - Verify members array has entries

## Debugging Steps

### Step 1: Check Environment Variables
Run in terminal:
```bash
cd "c:\Users\digital\Desktop\my assignment\Moviegrtr"
type .env
```

Should show:
```
REACT_APP_EMAILJS_SERVICE_ID="service_ptezuw3"
REACT_APP_EMAILJS_TEMPLATE_ID="template_3c5zryf"
REACT_APP_EMAILJS_PUBLIC_KEY="37_XtPYJCDpBe5k5y"
```

### Step 2: Test EmailJS Package
Open browser console and run:
```javascript
import('@emailjs/browser').then(m => console.log('✅ Package installed:', m))
  .catch(e => console.error('❌ Package missing:', e));
```

### Step 3: Check Browser Console Logs
When proposing a movie, you should see:
```
=== PROPOSING MOVIE ===
Selected Group ID: group_xxx
Movie: {title: "...", ...}
Group Data: {name: "...", members: [...]}
Creating proposal...
Proposal created: {proposalId: "...", ...}
🔄 Starting email notification process...
EmailJS Config: {serviceId: "service_ptezuw3", templateId: "template_3c5zryf", ...}
✅ EmailJS client loaded successfully
📧 Preparing to send emails to group members: [...]
📨 Sending to X members (excluding proposer)
📧 Email 1/X: {to: "...", movie: "..."}
✅ Email sent to user@email.com: {status: 200, text: "OK"}
✅ All proposal notifications sent successfully
=== PROPOSAL COMPLETE ===
```

### Step 4: Test End-to-End Flow

1. **Login** to the app
2. **Create a Group:**
   - Go to "GROUPS" menu
   - Click "Create Group"
   - Name: "Test Group"
   - Add your own email address as a member
   - Click "Create Group"

3. **Propose a Movie:**
   - Browse movies
   - Click any movie to view details
   - Click "Propose to Group" button
   - Select "Test Group"
   - Click "Propose Movie"

4. **Check Results:**
   - Watch browser console for logs
   - Check the alert message
   - Check your email inbox
   - Check spam folder

## EmailJS Dashboard

### Check Email History
1. Go to: https://dashboard.emailjs.com/
2. Login with your account
3. Click "Email History" in sidebar
4. You should see sent emails with status "Sent" or "Delivered"

### Monthly Quota
- Free plan: 200 emails/month
- Check usage in dashboard
- If exceeded, emails won't send

## Still Not Working?

### Last Resort Checks

1. **Verify EmailJS Account:**
   - Log in to https://www.emailjs.com/
   - Verify email address is confirmed
   - Check account is active

2. **Template Configuration:**
   - Template ID must be exactly: `template_3c5zryf`
   - Template must be published (not draft)
   - Service must be connected to template

3. **Service Configuration:**
   - Service ID must be exactly: `service_ptezuw3`
   - Service must be active
   - Check email service provider is connected

4. **Browser Issues:**
   - Try different browser
   - Disable ad blockers
   - Clear browser cache
   - Hard reload: `Ctrl+Shift+R`

5. **Network Issues:**
   - Check internet connection
   - Try on different network
   - Check firewall settings

## Contact for Help

If still not working, provide:
1. Browser console screenshot showing all logs
2. EmailJS dashboard screenshot (Email History)
3. Alert message text
4. Which test method you tried

## Success Indicators

✅ **Email is working if you see:**
- Console: "✅ All proposal notifications sent successfully"
- Alert: "Sent X email notification(s)"
- EmailJS Dashboard: Shows sent emails
- Email arrives in inbox (check spam too!)

❌ **Email is NOT working if you see:**
- Console: "📧 EMAIL NOTIFICATION (Demo Mode)"
- Alert: "Running in demo mode - emails not sent"
- No entries in EmailJS dashboard
- No email in inbox or spam
