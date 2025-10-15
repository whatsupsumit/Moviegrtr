# EmailJS Setup Guide - FREE Email Notifications 📧

## Why EmailJS?
- ✅ **100% FREE** - 300 emails per month
- ✅ **No Backend Required** - Works directly from React
- ✅ **Easy Setup** - Just 5 minutes
- ✅ **Supports Gmail** - Use your own Gmail to send emails

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account
1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up"** (top right)
3. Sign up with your **Gmail account** (recommended)
4. Verify your email

### Step 2: Connect Your Gmail
1. After login, you'll see the **Dashboard**
2. Click **"Email Services"** in left sidebar
3. Click **"Add New Service"**
4. Select **"Gmail"**
5. Click **"Connect Account"**
6. Choose your **Gmail account** and allow access
7. Give it a name like **"My Gmail"**
8. Click **"Create Service"**
9. **COPY the Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template
1. Click **"Email Templates"** in left sidebar
2. Click **"Create New Template"**
3. **Replace the default template** with this:

#### Template Settings:
- **Template Name**: `movie_proposal`

#### Email Content:
```
Subject: 🎬 New Movie Proposal: {{movie_title}}

From Name: Moviegrtr App

To Email: {{to_email}}

Message Body:
Hi {{to_name}},

{{from_name}} has proposed a movie for your group "{{group_name}}"!

🎬 Movie: {{movie_title}}
⭐ Rating: {{movie_rating}}
📅 Proposed by: {{from_name}}

{{movie_overview}}

Vote now on Moviegrtr app!

---
Sent from Moviegrtr - Your Group Movie Picker
```

4. Click **"Save"**
5. **COPY the Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Click **"Account"** in left sidebar (or your profile icon)
2. Scroll to **"API Keys"** section
3. **COPY your Public Key** (looks like: `xxxxxxxxxxxxxx`)

### Step 5: Add Keys to .env File
1. Open your `.env` file in the Moviegrtr folder
2. Add these lines at the bottom:

```env
# EmailJS Configuration (for email notifications)
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxx
```

3. **Replace** the `xxxxxxx` with your actual IDs from EmailJS
4. **SAVE** the file

### Step 6: Restart Your App
1. Stop the server: Press `Ctrl + C` in terminal
2. Start again: `npm start`
3. **Done!** 🎉

---

## 📧 How It Works

When you propose a movie to a group:
1. Click "Propose to Group" on any movie
2. Select your group
3. **Emails are automatically sent** to all group members!

Each member receives:
- Movie title and poster
- Rating and overview
- Who proposed it
- Link to vote

---

## 🧪 Test It

1. **Create a test group** with your own email addresses
2. **Propose a movie** to the group
3. **Check your Gmail inbox** - you should receive an email!

---

## 📊 Free Tier Limits

- **300 emails per month** - FREE
- **50 requests per hour**
- **2 email services**
- **Unlimited templates**

For a hackathon and personal use, this is more than enough!

---

## 🛠️ Already Done For You

✅ EmailJS package installed
✅ Email service code written (`src/utils/emailService.js`)
✅ Integration with Groups component
✅ Error handling and fallbacks

**You just need to:**
1. Create EmailJS account
2. Connect Gmail
3. Create template
4. Add 3 keys to `.env`
5. Restart app

---

## 🆘 Troubleshooting

### Emails not sending?
1. Check browser console (F12) for errors
2. Verify all 3 keys in `.env` are correct
3. Make sure you restarted the app after adding keys
4. Check EmailJS dashboard for usage/errors

### Invalid template error?
- Make sure template variables match: `{{movie_title}}`, `{{to_name}}`, etc.
- Template ID must be correct

### Rate limit error?
- Free tier: 50 requests/hour
- Wait an hour or upgrade (still free for basic use)

---

## 🎯 Alternative: WhatsApp (Future Enhancement)

WhatsApp Business API is **not free** for individuals, but here's what you'd need:
- WhatsApp Business Account (verified business required)
- Twilio/Meta API access ($$$)
- Phone number verification

**Recommendation**: Stick with EmailJS for now - it's perfect for your hackathon!

---

## 📝 Summary

| Feature | EmailJS | Gmail API | WhatsApp API |
|---------|---------|-----------|--------------|
| Cost | FREE ✅ | FREE (complex) | Paid ❌ |
| Setup Time | 5 mins ✅ | 2 hours | 1+ day |
| Hackathon Ready | Yes ✅ | Maybe | No ❌ |
| No Backend | Yes ✅ | No | No ❌ |
| Emails/Month | 300 | Unlimited | N/A |

**Winner: EmailJS** 🏆

---

Need help? Check the console for error messages or ask me!
