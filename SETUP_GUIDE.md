# HRFlow-AI Setup Guide

**Complete production-ready setup instructions for deploying the AI hiring agent application.**

## 📋 Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (free tier works)
- EmailJS account (free tier works)
- Calendly account (free tier works)
- Optional: Lovable Cloud account for AI backend

## 🚀 Installation & Local Development

### 1. Clone Repository

```bash
git clone https://github.com/CoderAnimeshSingh/HRFlow-AI.git
cd HRFlow-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# EmailJS Configuration (for client-side email)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here

# Optional: Use server-side email (Supabase Edge Function)
VITE_USE_SERVER_EMAIL=false

# Calendly Configuration
VITE_CALENDLY_BASE_URL=https://calendly.com/your-username/your-event

# Company Information
VITE_COMPANY_NAME=Your Company Name
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` (or the displayed port).

### 5. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 🔧 Service Setup Instructions

### Supabase Setup

1. **Create a Supabase project** at https://supabase.com
2. **Create the `candidates` table** with the following schema:

```sql
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  job_role_applied TEXT NOT NULL,
  resume_url TEXT,
  resume_text TEXT,
  experience_years INTEGER,
  skills TEXT[],
  ai_fit_score INTEGER,
  ai_summary TEXT,
  status TEXT DEFAULT 'new',
  test_link TEXT,
  test_score INTEGER,
  interview_date_time TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "public_insert" ON candidates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_read" ON candidates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update" ON candidates
  FOR UPDATE USING (auth.role() = 'authenticated');
```

3. **Deploy Edge Functions**:
   - `ai-resume-parser`: Resume analysis (uses Lovable AI Gateway)
   - `send-invite`: Server-side email sending

4. **Set Environment Secrets** (for Edge Functions):
   - `LOVABLE_API_KEY`: Your Lovable API key (for AI analysis)
   - `EMAILJS_USER_ID`: From EmailJS
   - `EMAILJS_SERVICE_ID`: From EmailJS
   - `EMAILJS_TEMPLATE_ID`: From EmailJS

### EmailJS Setup

1. **Sign up** at https://www.emailjs.com/
2. **Create a service** (e.g., Gmail, SendGrid)
3. **Create an email template** with variables:
   - `to_name`
   - `to_email`
   - `interview_datetime`
   - `company_name`
   - `notes`

4. **Get your credentials**:
   - Service ID
   - Template ID
   - Public Key (for `VITE_EMAILJS_PUBLIC_KEY`)
   - User ID (for Supabase Edge Function)

### Calendly Setup

1. **Sign up** at https://calendly.com/
2. **Create a scheduling link** (e.g., `/meeting`)
3. **Copy your base URL**: `https://calendly.com/your-username/meeting`
4. **Add to `.env`** as `VITE_CALENDLY_BASE_URL`

---

## 🧪 Testing the Features

### Test Candidate Comparison
1. Add at least 2 candidates
2. Check the checkboxes next to candidates
3. Click "Compare" button
4. Modal shows side-by-side comparison

### Test Email Invites
1. Open a candidate modal
2. Fill in "Interview Date & Time"
3. Click "Send Invite"
4. Check candidate's email inbox

### Test Interview Scheduling
1. Open a candidate modal
2. Click "Schedule (Calendly)"
3. Your Calendly page opens (pre-filled with name/email)

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts and add environment variables in Vercel dashboard.

### Option 2: Netlify

1. Connect your GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option 3: Self-Hosted (Docker)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t hrflow-ai .
docker run -p 3000:3000 hrflow-ai
```

### Option 4: Lovable Cloud (Native)

1. Push to GitHub
2. Visit https://lovable.dev
3. Create project from GitHub repo
4. Click **Share → Publish**
5. Configure custom domain

---

## 🔐 Security Checklist

- [ ] Never commit `.env` to Git (add to `.gitignore`)
- [ ] Use Supabase RLS for database access control
- [ ] Keep API keys in environment variables (not in code)
- [ ] Use server-side email function (`send-invite`) for production (keeps keys secret)
- [ ] Enable HTTPS for all deployments
- [ ] Configure CORS if using a separate API domain
- [ ] Regularly rotate API keys and tokens

---

## 📊 Performance Optimization

### Code Splitting

The bundle size warning suggests using dynamic imports:

```typescript
// Lazy load heavy components
const CandidateCompare = lazy(() => import('./components/dashboard/CandidateCompare'));
```

### Database Indexes

Add indexes to `candidates` table for faster queries:

```sql
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_created_at ON candidates(created_at DESC);
```

### Image Optimization

- Use WebP format for resume thumbnails
- Lazy-load images with `loading="lazy"`

---

## 🐛 Troubleshooting

### Email not sending?
- Check EmailJS service is active
- Verify credentials in `.env`
- Test with EmailJS dashboard
- Check spam folder

### Candidate data not showing?
- Verify Supabase connection in browser console
- Check RLS policies allow authenticated reads
- Ensure user is logged in

### Comparison modal blank?
- Select at least 2 candidates
- Check browser console for errors

### Build errors?
- Clear `node_modules` and `dist`
- Run `npm install` again
- Check Node version: `node --version` (should be 18+)

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 📞 Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/CoderAnimeshSingh/HRFlow-AI/issues)
2. Review this guide's troubleshooting section
3. Check service documentation (Supabase, EmailJS, Calendly)

---

**Last Updated:** December 13, 2025  
**Status:** Production Ready ✅
