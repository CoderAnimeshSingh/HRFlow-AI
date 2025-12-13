# HRFlow AI - Automated Hiring & Onboarding Platform

![HRFlow AI](https://img.shields.io/badge/HRFlow-AI%20Powered-00A896?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

A modern, AI-powered hiring and candidate management platform that automates resume screening, candidate tracking, and the entire recruitment pipeline.

## 🚀 Features

### Core Functionality

- **🤖 AI-Powered Resume Screening** - Automatically analyze and score candidates using advanced AI
- **📝 Candidate Intake Form** - Beautiful, responsive application form for job seekers
- **📊 Dashboard & Analytics** - Real-time candidate pipeline management with statistics
- **🔐 Secure Authentication** - Full login/signup system with role-based access
- **⚡ Real-time Updates** - Live candidate data sync across all sessions

### Technical Highlights

- **Modern React Architecture** - Built with React 18, TypeScript, and Vite
- **Responsive Design** - Fully mobile-optimized interface
- **Beautiful UI** - Custom design system with Tailwind CSS and shadcn/ui
- **Smooth Animations** - Framer Motion for polished interactions
- **Cloud Backend** - Serverless architecture with Lovable Cloud

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features Overview](#features-overview)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd hrflow-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
hrflow-ai/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── CandidateTable.tsx
│   │   │   └── CandidateModal.tsx
│   │   ├── ui/              # shadcn/ui components
│   │   ├── CTA.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pricing.tsx
│   │   ├── Process.tsx
│   │   └── Stats.tsx
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party integrations
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Auth.tsx         # Authentication page
│   │   ├── Dashboard.tsx    # Admin dashboard
│   │   ├── Apply.tsx        # Candidate application form
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles & design tokens
├── supabase/
│   ├── functions/           # Edge functions
│   │   └── ai-resume-parser/# AI resume analysis function
│   └── config.toml          # Supabase configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Project dependencies
```

## ✨ Features Overview

### 1. Landing Page
- Professional, conversion-optimized design
- Animated hero section with value proposition
- Features grid showcasing platform capabilities
- 4-step process visualization
- Pricing tiers
- Email capture CTA

### 2. Authentication System
- Secure email/password authentication
- Auto-confirm email signups (configurable)
- Protected dashboard routes
- Session persistence

### 3. Candidate Application Form (`/apply`)
- Clean, user-friendly interface
- Job role selection
- Resume content paste & AI analysis
- Real-time submission feedback

### 4. Admin Dashboard (`/dashboard`)
- **Statistics Cards**: Total candidates, new applications, in-progress, average AI score
- **Candidate Table**: Sortable, filterable candidate list
- **Status Management**: Track candidates through the pipeline
- **Candidate Modal**: 
  - AI analysis results
  - Resume viewer
  - Interview scheduling
  - Test link management
  - Notes

### 5. AI Resume Screening
- Powered by Google Gemini 2.5 Flash
- Automatic skill extraction
- Experience estimation
- Fit score calculation (0-100)
- Strengths & concerns analysis
- Recommended interview questions

## 🔌 API Documentation

### Edge Functions

#### `ai-resume-parser`
Analyzes candidate resumes using AI.

**Endpoint:** `POST /functions/v1/ai-resume-parser`

**Request Body:**
```json
{
  "resumeText": "Full resume content...",
  "jobRole": "Software Engineer",
  "candidateName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "fitScore": 85,
    "skills": ["JavaScript", "React", "Node.js"],
    "experienceYears": 5,
    "summary": "Strong full-stack developer...",
    "strengths": ["Modern tech stack", "Team leadership"],
    "concerns": ["No TypeScript experience"],
    "recommendedQuestions": ["Describe your experience with..."]
  }
}
```

## 🗄️ Database Schema

### Tables

#### `candidates`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Candidate's full name |
| email | TEXT | Contact email |
| phone | TEXT | Phone number (optional) |
| job_role_applied | TEXT | Position applied for |
| resume_url | TEXT | Resume file URL (optional) |
| resume_text | TEXT | Resume content |
| experience_years | INTEGER | Years of experience |
| skills | TEXT[] | Array of skills |
| ai_fit_score | INTEGER | AI-calculated fit score (0-100) |
| ai_summary | TEXT | AI-generated summary |
| status | TEXT | Pipeline status |
| test_link | TEXT | Assessment test URL |
| test_score | INTEGER | Test results |
| interview_date_time | TIMESTAMP | Scheduled interview |
| notes | TEXT | Recruiter notes |
| created_at | TIMESTAMP | Application date |
| updated_at | TIMESTAMP | Last modified |

#### Status Values
- `new` - Fresh application
- `screening` - Under AI/manual review
- `interview` - Interview scheduled
- `test` - Assessment in progress
- `offer` - Offer extended
- `hired` - Successfully hired
- `rejected` - Application declined

### Row Level Security (RLS)
- **Public**: Can submit applications
- **Authenticated**: Can view all candidates
- **Moderators**: Can update candidates
- **Admins**: Full CRUD access

## 🚀 Deployment

### Deploy with Lovable

1. Visit [Lovable](https://lovable.dev)
2. Open your project
3. Click **Share → Publish**

### Custom Domain

1. Navigate to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Follow DNS configuration instructions

### Environment Variables

The following variables are auto-configured:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Backend secrets (auto-provisioned):
- `LOVABLE_API_KEY` - AI gateway authentication

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| Framer Motion | Animations |
| React Router | Routing |
| TanStack Query | Data Fetching |
| Lovable Cloud | Backend |

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support, please contact the development team or open an issue in the repository.

---

Built with ❤️ using [Lovable](https://lovable.dev)

## ✅ Local Integrations Added

- **Email Notifications (EmailJS)**: Client-side email sending has been added for interview invites using `@emailjs/browser`. Configure `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` in your `.env`.
- **Interview Scheduling (Calendly)**: Quick scheduling button opens a Calendly event (configure `VITE_CALENDLY_BASE_URL`).
- **Candidate Comparison**: Side-by-side candidate comparison modal (select up to 3 candidates in the table and click Compare).

See `src/components/dashboard/CandidateCompare.tsx`, `src/lib/email.ts`, and changes in `src/components/dashboard/CandidateTable.tsx` and `src/components/dashboard/CandidateModal.tsx`.
