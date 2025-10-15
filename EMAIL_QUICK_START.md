# 🚀 QUICK START - Email Notifications

## What You Have Now:
✅ EmailJS package installed
✅ Email service code ready
✅ Server running successfully
✅ Just need to configure EmailJS account

---

## ⚡ 3-Minute Setup

### 1. Create Account (1 min)
- Go to: **https://www.emailjs.com/**
- Click "Sign Up"
- Use your Gmail

### 2. Connect Gmail (1 min)
- Dashboard → "Email Services" → "Add New Service"
- Select "Gmail" → Connect your account
- Copy the **Service ID** (like: `service_abc123`)

### 3. Create Template (1 min)
- Dashboard → "Email Templates" → "Create New Template"
- **Copy this template:**

```
Subject: 🎬 {{movie_title}} - New Movie Proposal!

Hi {{to_name}},

{{from_name}} wants to watch {{movie_title}} with your group "{{group_name}}"!

⭐ Rating: {{movie_rating}}/10
📝 {{movie_overview}}

Vote now on the app!

Cheers,
Moviegrtr Team
```

- Save and copy the **Template ID** (like: `template_xyz789`)

### 4. Get Public Key
- Dashboard → Account → API Keys
- Copy your **Public Key** (like: `aBcDeF123456`)

### 5. Update .env File
Open `.env` and replace these 3 lines:

```env
REACT_APP_EMAILJS_SERVICE_ID="service_abc123"
REACT_APP_EMAILJS_TEMPLATE_ID="template_xyz789"
REACT_APP_EMAILJS_PUBLIC_KEY="aBcDeF123456"
```

### 6. Restart Server
- Terminal: Press `Ctrl + C`
- Run: `npm start`
- Done! 🎉

---

## 🧪 Test It Right Now

1. Open app: http://localhost:3000
2. Login/Sign up
3. Go to "GROUPS" page
4. Create a group with your email addresses
5. Browse a movie → Click "Propose to Group"
6. **Check your Gmail!** 📧

---

## 📊 What You Get FREE

- **300 emails/month** - Perfect for hackathon!
- **Real email delivery** via Gmail
- **No backend needed**
- **Works immediately**

---

## 🎯 How It Works

```
You propose movie → EmailJS sends → Gmail delivers → Friends receive
```

Every group member gets:
- Movie title & poster
- Rating & overview  
- Who proposed it
- Call to vote

---

## 🔗 Quick Links

- EmailJS Dashboard: https://dashboard.emailjs.com/
- Full Setup Guide: See `EMAILJS_SETUP.md`
- Troubleshooting: Check browser console (F12)

---

**Ready to send emails in 3 minutes!** ⏱️
