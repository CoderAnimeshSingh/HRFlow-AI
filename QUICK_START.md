# 🚀 HRFlow-AI - Quick Start (5 Minutes)

**Get the HRFlow-AI hiring platform running in 5 minutes.**

---

## Step 1: Clone & Install (1 minute)

```bash
git clone https://github.com/CoderAnimeshSingh/HRFlow-AI.git
cd HRFlow-AI
npm install
```

---

## Step 2: Create `.env` File (2 minutes)

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Required: Get from Supabase dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Required: Get from EmailJS
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Required: Get from Calendly
VITE_CALENDLY_BASE_URL=https://calendly.com/your-username/event

# Optional: Company name
VITE_COMPANY_NAME=My Company
```

**Don't have these accounts?** Create them now (all free):
- Supabase: https://supabase.com
- EmailJS: https://www.emailjs.com
- Calendly: https://calendly.com

---

## Step 3: Start Dev Server (1 minute)

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Step 4: Test It (1 minute)

### Scenario 1: Apply for a Job
1. Click **"Apply Now"** on landing page
2. Fill in the form
3. Submit ✅

### Scenario 2: View Dashboard
1. Click **"Get Started"** or go to `/dashboard`
2. Sign up with email/password
3. See the admin panel ✅

### Scenario 3: Send Email Invite
1. On dashboard, click **"View"** on any candidate
2. Set an interview date
3. Click **"Send Invite"**
4. Check your email ✅

---

## 📱 Features at a Glance

| Feature | Status |
|---------|--------|
| Candidate applications | ✅ |
| AI resume analysis | ✅ |
| Candidate pipeline | ✅ |
| Email invitations | ✅ |
| Interview scheduling | ✅ |
| Candidate comparison | ✅ |
| Real-time updates | ✅ |
| Mobile responsive | ✅ |

---

## 🔧 Next: Configure Services

After getting the app running, set up each service:

### Supabase Setup (5 min)
1. Create account at https://supabase.com
2. Create project
3. Get URL and Key from Settings
4. Create `candidates` table (see SETUP_GUIDE.md)

### EmailJS Setup (5 min)
1. Create account at https://www.emailjs.com
2. Create email service
3. Create email template
4. Get Service ID, Template ID, Public Key

### Calendly Setup (2 min)
1. Create account at https://calendly.com
2. Create scheduling event
3. Copy your Calendly URL
4. Add to `.env`

---

## 🚀 Deploy

### Deploy to Vercel (Easiest)
1. Push code to GitHub
2. Go to https://vercel.com
3. Connect GitHub repo
4. Add environment variables
5. Deploy ✅

### Deploy to Netlify
1. Push code to GitHub
2. Go to https://netlify.com
3. Connect GitHub repo
4. Add build command: `npm run build`
5. Add environment variables
6. Deploy ✅

### Deploy to Docker
```bash
docker build -t hrflow-ai .
docker run -p 3000:3000 hrflow-ai
```

---

## 📚 Documentation

- **[Full Setup Guide](./SETUP_GUIDE.md)** - Detailed configuration
- **[Features Guide](./FEATURES.md)** - Complete feature list
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deploy verification
- **[Main README](./README.md)** - Project overview

---

## ⚡ Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**npm install fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Can't send emails?**
1. Check EmailJS credentials in `.env`
2. Verify email service is active in EmailJS dashboard
3. Check spam folder
4. Review EmailJS logs

**Supabase connection error?**
1. Verify URL and key in `.env`
2. Check Supabase project is active
3. Check database `candidates` table exists
4. Test connection in Supabase dashboard

---

## 🎯 What's Included

- ✅ Modern React 18 + TypeScript
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Supabase backend + auth
- ✅ AI resume analysis (OpenAI-powered)
- ✅ Email notifications (EmailJS)
- ✅ Interview scheduling (Calendly)
- ✅ Candidate comparison
- ✅ Real-time updates
- ✅ Mobile responsive
- ✅ Production-ready

---

## 💬 Need Help?

1. **Check docs**: Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **GitHub Issues**: Open an issue on https://github.com/CoderAnimeshSingh/HRFlow-AI
3. **Service docs**:
   - [Supabase Docs](https://supabase.com/docs)
   - [EmailJS Docs](https://www.emailjs.com/docs/)
   - [Calendly Docs](https://calendly.com/help)

---

**Ready? Let's go! 🚀**

```bash
npm install && npm run dev
```

Then open http://localhost:5173

---

**Status:** Production Ready ✅  
**Version:** 1.0.0  
**Last Updated:** December 13, 2025
