# 🚀 HRFlow-AI - Deployment Checklist

**Use this checklist to ensure everything is configured before deploying to production.**

---

## Pre-Deployment Checklist

### Repository & Git
- [ ] Repo cloned locally
- [ ] All changes committed
- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` in repo (no secrets)
- [ ] Latest commit pushed to GitHub

### Code Quality
- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` runs (pre-existing UI warnings OK)
- [ ] No console errors in dev server
- [ ] No critical TypeScript errors

### Dependencies
- [ ] All packages installed: `npm install`
- [ ] Package.json up to date
- [ ] No high vulnerabilities: `npm audit`

---

## Supabase Setup

### Database
- [ ] `candidates` table created with correct schema
- [ ] RLS (Row Level Security) enabled
- [ ] Policies created:
  - [ ] `public_insert` - Anyone can insert
  - [ ] `auth_read` - Authenticated users can read
  - [ ] `auth_update` - Authenticated users can update
- [ ] Indexes created for performance:
  - [ ] `idx_candidates_status`
  - [ ] `idx_candidates_email`
  - [ ] `idx_candidates_created_at`

### Authentication
- [ ] Email provider configured
- [ ] Auto-confirm enabled (or manual email verification)
- [ ] JWT secret configured
- [ ] Redirect URLs configured

### Edge Functions
- [ ] `ai-resume-parser` deployed
- [ ] `send-invite` deployed
- [ ] Environment secrets set:
  - [ ] `LOVABLE_API_KEY` (for resume analysis)
  - [ ] `EMAILJS_USER_ID` (for email function)
  - [ ] `EMAILJS_SERVICE_ID` (for email function)
  - [ ] `EMAILJS_TEMPLATE_ID` (for email function)

### Connection
- [ ] `VITE_SUPABASE_URL` noted
- [ ] `VITE_SUPABASE_ANON_KEY` noted

---

## EmailJS Configuration

### Email Service
- [ ] Account created at https://www.emailjs.com/
- [ ] Email service configured (Gmail, SendGrid, etc.)
- [ ] Sender verified (check email from service provider)

### Email Template
- [ ] Template created with variables:
  - [ ] `to_name`
  - [ ] `to_email`
  - [ ] `interview_datetime`
  - [ ] `company_name`
  - [ ] `notes`
- [ ] Template ID noted
- [ ] Service ID noted
- [ ] Public Key noted
- [ ] Template tested (sent test email)

### Configuration
- [ ] `VITE_EMAILJS_SERVICE_ID` in `.env`
- [ ] `VITE_EMAILJS_TEMPLATE_ID` in `.env`
- [ ] `VITE_EMAILJS_PUBLIC_KEY` in `.env`

### Server-side Setup (Optional, Recommended)
- [ ] `VITE_USE_SERVER_EMAIL=true` if using Supabase function
- [ ] Supabase secrets configured:
  - [ ] `EMAILJS_USER_ID`
  - [ ] `EMAILJS_SERVICE_ID`
  - [ ] `EMAILJS_TEMPLATE_ID`

---

## Calendly Configuration

### Scheduling Link
- [ ] Account created at https://calendly.com/
- [ ] Event created (e.g., "Interview")
- [ ] Event link generated (e.g., calendly.com/john-doe/interview)
- [ ] Link tested (can book a time slot)

### Configuration
- [ ] `VITE_CALENDLY_BASE_URL` in `.env`
- [ ] Test that "Schedule (Calendly)" button works

---

## Environment Variables

### Required
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_EMAILJS_SERVICE_ID`
- [ ] `VITE_EMAILJS_TEMPLATE_ID`
- [ ] `VITE_EMAILJS_PUBLIC_KEY`
- [ ] `VITE_CALENDLY_BASE_URL`

### Optional
- [ ] `VITE_COMPANY_NAME`
- [ ] `VITE_USE_SERVER_EMAIL`

### Deployment Platform Secrets
If deploying to Vercel/Netlify:
- [ ] All env vars added to platform dashboard
- [ ] Environment-specific configs set (dev/prod)
- [ ] Preview environment uses test credentials

---

## Feature Testing

### Authentication
- [ ] Can sign up new account
- [ ] Can log in
- [ ] Can log out
- [ ] Session persists on page reload
- [ ] Unauthenticated users redirected to /auth

### Candidate Application
- [ ] Can visit `/apply` page
- [ ] Can submit application without login
- [ ] Resume content parsed correctly
- [ ] AI analysis completes (or gracefully fails)
- [ ] Success message displays

### Dashboard
- [ ] Can access `/dashboard` (must be logged in)
- [ ] Statistics cards display correct counts
- [ ] Candidate table shows all candidates
- [ ] Can search candidates
- [ ] Can filter by status
- [ ] Can change candidate status

### Candidate Modal
- [ ] Modal opens when clicking "View"
- [ ] Personal info displays correctly
- [ ] AI score color-coded properly
- [ ] Can view resume content
- [ ] Can update notes
- [ ] Can set interview date/time
- [ ] Can save changes
- [ ] Can click "Re-analyze" button

### Email Invitations
- [ ] Can click "Send Invite"
- [ ] Email appears in candidate's inbox (within 2 min)
- [ ] Email contains correct information
- [ ] Error toast if email fails
- [ ] Can retry if failed

### Interview Scheduling
- [ ] Can click "Schedule (Calendly)"
- [ ] New tab opens with Calendly link
- [ ] Candidate name/email pre-filled (if available)
- [ ] Can select time slot
- [ ] Calendar updated after booking

### Candidate Comparison
- [ ] Can select checkboxes (up to 3)
- [ ] "Selected" counter updates
- [ ] "Compare" button enables at 2+ selections
- [ ] Modal opens with comparison table
- [ ] All fields display correctly
- [ ] Can deselect and reselect

---

## Performance & Optimization

### Build
- [ ] Production build size acceptable (<1 MB gzipped)
- [ ] No console errors in production build
- [ ] Images optimized
- [ ] CSS minified

### Lighthouse Scores
- [ ] Performance: >80
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >90

### Database
- [ ] Indexes created on frequently queried columns
- [ ] RLS policies optimized (not too restrictive)
- [ ] Real-time subscriptions working

---

## Security

### Code Security
- [ ] No API keys in source code
- [ ] `.env` excluded from Git
- [ ] TypeScript strict mode enabled
- [ ] No console.log statements with sensitive data

### Database Security
- [ ] RLS policies in place
- [ ] Public table not exposed unnecessarily
- [ ] Admin secrets not shared
- [ ] Rate limiting enabled (if available)

### API Security
- [ ] CORS properly configured
- [ ] Input validation on server
- [ ] SQL injection prevention (using Supabase)
- [ ] XSS prevention (React defaults)

---

## Deployment Platforms

### Option: Vercel
- [ ] Connected GitHub account
- [ ] Project imported
- [ ] Build settings correct:
  - [ ] Framework: Next.js (or Vite)
  - [ ] Build command: `npm run build`
  - [ ] Output dir: `dist`
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Custom domain configured (optional)

### Option: Netlify
- [ ] Connected GitHub account
- [ ] Site created
- [ ] Build settings:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Custom domain configured (optional)

### Option: Docker/Self-hosted
- [ ] Dockerfile created
- [ ] Docker image builds: `docker build -t hrflow-ai .`
- [ ] Container runs: `docker run -p 3000:3000 hrflow-ai`
- [ ] Port exposed correctly
- [ ] Env vars passed to container
- [ ] Server configured (nginx, Apache, etc.)

### Option: Lovable Cloud
- [ ] GitHub repo connected
- [ ] Project created in Lovable dashboard
- [ ] Published successfully
- [ ] Custom domain configured

---

## Post-Deployment

### Monitoring
- [ ] Error tracking enabled (Sentry, LogRocket)
- [ ] Analytics enabled (Google Analytics, Plausible)
- [ ] Uptime monitoring configured
- [ ] Log aggregation enabled

### Backups
- [ ] Database backups scheduled
- [ ] Backup tested (can restore)
- [ ] Backup retention policy set

### Documentation
- [ ] README up to date
- [ ] SETUP_GUIDE.md matches deployment
- [ ] FEATURES.md current
- [ ] Changelog updated

### Client Handoff
- [ ] Demo provided to client
- [ ] All features explained
- [ ] Support contact info provided
- [ ] Documentation shared
- [ ] Access credentials provided securely

---

## Final Sign-off

- [ ] All checklist items complete
- [ ] No critical issues remaining
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Client ready to use

**Deployed By:** ___________________  
**Date:** ___________________  
**Environment:** ☐ Dev | ☐ Staging | ☐ Production  
**Sign-off:** ___________________  

---

## Support & Troubleshooting

**If something doesn't work:**

1. Check `.env` values are correct
2. Review browser console for errors
3. Check Supabase logs (Edge Functions)
4. Check EmailJS dashboard for bounce/error logs
5. See [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section

---

**Ready to deploy! 🚀**

For questions or issues, open a GitHub issue or contact support.
