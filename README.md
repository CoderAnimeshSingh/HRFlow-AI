# HRFlow AI - Automated Hiring & Onboarding Platform

![HRFlow AI](https://img.shields.io/badge/HRFlow-AI%20Powered-00A896?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

A modern, AI-powered hiring and candidate management platform that automates resume screening, candidate tracking, and the entire recruitment pipeline.

## 🚀 Live Demo

Visit the live application to see HRFlow AI in action.

## ✨ Features

### Core Functionality

- **🤖 AI-Powered Resume Screening** - Automatically analyze and score candidates using Google Gemini AI
- **📝 Candidate Intake Form** - Beautiful, responsive application form for job seekers
- **📊 Dashboard & Analytics** - Real-time candidate pipeline management with statistics
- **🔐 Secure Authentication** - Full login/signup system with role-based access control
- **⚡ Real-time Updates** - Live candidate data sync across all sessions

### Advanced Features

- **💌 Email Notifications** - Send interview invites directly from the dashboard
- **📅 Interview Scheduling** - Calendly integration for seamless scheduling
- **🔄 Candidate Comparison** - Compare up to 3 candidates side-by-side with AI recommendations
- **📱 Mobile Responsive** - Fully optimized for all device sizes

### Technical Highlights

- **Serverless Architecture** - Powered by edge functions for scalability
- **Row-Level Security** - Enterprise-grade data protection
- **Real-time Database** - Instant updates across all connected clients

## 📋 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Get running in 5 minutes |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete setup & configuration |
| [FEATURES.md](./FEATURES.md) | Feature documentation |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment verification |

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hrflow-ai.git
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
│   │   │   ├── CandidateModal.tsx
│   │   │   └── CandidateCompare.tsx
│   │   ├── ui/              # UI component library
│   │   ├── CTA.tsx
│   │   ├── Features.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pricing.tsx
│   │   ├── Process.tsx
│   │   └── Stats.tsx
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Backend integrations
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
│   │   ├── ai-resume-parser/# AI resume analysis
│   │   └── send-invite/     # Email notification service
│   └── config.toml          # Backend configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Project dependencies
```

## ✨ Features Overview

### 1. Landing Page (`/`)
- Professional, conversion-optimized design
- Animated hero section with value proposition
- Features grid showcasing platform capabilities
- 4-step process visualization
- Pricing tiers
- Email capture CTA

### 2. Authentication System (`/auth`)
- Secure email/password authentication
- Auto-confirm email signups
- Protected dashboard routes
- Session persistence

### 3. Candidate Application Form (`/apply`)
- Clean, user-friendly interface
- Job role selection (15+ positions)
- Resume content paste & instant AI analysis
- Real-time submission feedback
- Mobile-optimized design

### 4. Admin Dashboard (`/dashboard`)
- **Statistics Cards**: Total candidates, new applications, in-progress, average AI score
- **Candidate Table**: 
  - Search & filter functionality
  - Status management dropdown
  - Bulk selection for comparison
  - Real-time updates
- **Candidate Modal**: 
  - AI analysis results with strengths & concerns
  - Full resume viewer
  - Interview scheduling with Calendly
  - Test link management
  - Notes & status updates
  - Email notification sending
- **Candidate Comparison**:
  - Side-by-side comparison of up to 3 candidates
  - AI recommendation for best fit
  - Skills, experience, and score comparison

### 5. AI Resume Screening
- Powered by Google Gemini 2.5 Flash
- Automatic skill extraction
- Experience estimation
- Fit score calculation (0-100%)
- Strengths & concerns analysis
- Recommended interview questions
- Re-analyze capability

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

#### `send-invite`
Sends interview invitation emails.

**Endpoint:** `POST /functions/v1/send-invite`

**Request Body:**
```json
{
  "candidateName": "John Doe",
  "candidateEmail": "john@example.com",
  "interviewDate": "2024-01-15T10:00:00Z",
  "notes": "Optional notes",
  "companyName": "Your Company"
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

### Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

### Custom Domain

Configure your custom domain through your hosting provider's settings.

### Environment Variables

Required environment variables (auto-configured in production):
- `VITE_SUPABASE_URL` - Database URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

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
| Google Gemini | AI Analysis |

## 📱 Mobile Responsiveness

HRFlow AI is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

## 🔒 Security Features

- **Row-Level Security (RLS)** - Database-level access control
- **Role-Based Access Control** - Admin, moderator, and user roles
- **Secure Authentication** - Industry-standard auth implementation
- **Input Validation** - All user inputs are validated
- **CORS Protection** - Cross-origin request protection

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support, please contact the development team.

---

Built with ❤️ by the HRFlow AI Team
