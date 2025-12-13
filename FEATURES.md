# HRFlow-AI - Complete Features Documentation

**A comprehensive guide to all features in the HRFlow-AI hiring platform.**

---

## 🎯 Core Features

### 1. Landing Page (Public)
- **Hero Section**: Eye-catching introduction with call-to-action
- **Features Grid**: Showcases platform capabilities
- **Process Timeline**: 4-step hiring flow visualization
- **Pricing Tiers**: Multiple subscription options
- **Email CTA**: Newsletter signup
- **Responsive Design**: Mobile-optimized layout

### 2. Candidate Application Form (`/apply`)
- **Simple Interface**: User-friendly job application
- **Resume Upload/Paste**: Multiple input methods
- **Job Role Selection**: Dropdown with available positions
- **AI Scoring**: Real-time resume analysis (OpenAI-powered)
- **Form Validation**: Client-side input validation
- **Success Feedback**: Toast notifications after submission

### 3. User Authentication (`/auth`)
- **Email/Password Login**: Secure Supabase auth
- **Sign-up**: New account creation
- **Session Persistence**: Auto-login on page reload
- **Protected Routes**: Dashboard requires authentication
- **Logout**: Secure session termination

### 4. Admin Dashboard (`/dashboard`)

#### Dashboard Header
- User profile display
- Welcome message
- Logout button
- Responsive navbar

#### Statistics Cards
- **Total Candidates**: Count of all applicants
- **New Applications**: Count of 'new' status
- **In Progress**: Count of candidates in pipeline
- **Average AI Score**: Mean fit score calculation

#### Candidate Pipeline Table
- **Searchable**: Filter by name, email, job role
- **Sortable**: Click column headers to sort
- **Status Filter**: Filter by pipeline stage
- **Selection Checkboxes**: Select up to 3 candidates
- **Comparison**: Compare selected candidates side-by-side
- **Refresh Button**: Manual data reload
- **Real-time Updates**: Live sync via Supabase

#### Candidate Detail Modal
- **Personal Info**: Name, email, phone, job role
- **AI Score Display**: Color-coded (red/yellow/green)
- **Tab Navigation**: AI Analysis | Resume | Actions

#### AI Analysis Tab
- **AI Fit Score**: 0-100 scale with color coding
- **AI Summary**: Executive summary of candidate profile
- **Skills Identified**: Extracted technical and soft skills
- **Experience Estimation**: Years of relevant experience
- **Re-analyze Button**: Refresh AI analysis from resume

#### Resume Tab
- **Raw Resume Text**: Full resume content display
- **Scrollable Preview**: For large resumes
- **Download Option**: Access original resume (if URL available)

#### Actions Tab
- **Status Dropdown**: new, screening, interview, test, offer, hired, rejected
- **Interview Scheduling**: Date/time picker
- **Test Link**: URL field for skills assessment
- **Test Score**: Numeric score (0-100)
- **Notes Field**: Recruiter notes and observations
- **Save Button**: Persist all changes
- **Send Invite Button**: Email interview invitations
- **Schedule (Calendly) Button**: Quick scheduling link

---

## 💌 Email Notifications

### Features
- **Candidate Invitations**: Send interview invites via email
- **Dual Mode**: Client-side (EmailJS) or server-side (Supabase Edge Function)
- **Pre-filled Data**: Automatically includes candidate details
- **Custom Messages**: Add notes to email invitations
- **Toast Feedback**: Success/error notifications

### How It Works

**Client-side (Default)**:
- Uses EmailJS browser SDK
- Email keys visible to user (use for testing only)
- Instant sending

**Server-side (Recommended for Production)**:
- Supabase Edge Function handles sending
- Email keys kept secure on server
- Set `VITE_USE_SERVER_EMAIL=true` in `.env`

### Email Template Variables
```
- {{to_name}}: Candidate's full name
- {{to_email}}: Candidate's email address
- {{interview_datetime}}: Scheduled interview date/time
- {{company_name}}: Your company name
- {{notes}}: Additional notes from recruiter
```

### Setup Instructions
1. Create EmailJS account: https://www.emailjs.com/
2. Create email service (Gmail, SendGrid, etc.)
3. Create email template with above variables
4. Get Service ID, Template ID, and Public Key
5. Add to `.env` file

---

## 📅 Interview Scheduling Integration

### Features
- **Calendly Integration**: Direct link to your scheduling calendar
- **Pre-filled Data**: Candidate name and email auto-populated
- **Quick Open**: One-click scheduling link
- **No Double-booking**: Calendly prevents overlapping meetings
- **Timezone Support**: Candidate can select their timezone

### How It Works
1. Open candidate detail modal
2. Click "Schedule (Calendly)" button
3. Your Calendly page opens in new tab
4. Candidate name and email pre-filled
5. Candidate selects available time slot
6. Calendar updated automatically

### Setup Instructions
1. Create Calendly account: https://calendly.com/
2. Create event (e.g., "Interview with Your Company")
3. Get your unique Calendly URL
4. Add to `.env` as `VITE_CALENDLY_BASE_URL`

### Alternative Integrations
- **Google Calendar API**: Can be added (contact support)
- **Microsoft Teams**: Can be integrated (contact support)

---

## 🔄 Candidate Comparison

### Features
- **Side-by-Side Comparison**: View multiple candidates at once
- **Up to 3 Candidates**: Select and compare simultaneously
- **Comprehensive Fields**: Job applied, AI fit, experience, skills, notes
- **Quick Selection**: Checkboxes in candidate table
- **Clear Selection**: Easy deselect with Clear button
- **Modal Display**: Clean, organized comparison view

### How It Works
1. Navigate to Dashboard
2. Check boxes next to 2-3 candidates to compare
3. Counter shows "Selected: 2"
4. Click "Compare (2)" button
5. Modal opens showing comparison table
6. View side-by-side candidate data

### Comparison Data Points
- **Job Applied**: Position each candidate applied for
- **AI Fit Score**: Comparison of fit percentages
- **Experience (years)**: Years of relevant experience
- **Skills**: Combined skill sets
- **Notes**: Recruiter notes for each candidate

---

## 🤖 AI Resume Analysis

### Features
- **Automatic Scoring**: AI-powered fit score (0-100)
- **Skill Extraction**: Identifies technical and soft skills
- **Experience Detection**: Estimates years of experience
- **Smart Summary**: Generates executive summary
- **Strengths & Concerns**: Highlights pros and cons
- **Interview Questions**: Suggests relevant questions
- **Re-analysis**: Update scoring anytime

### AI Engine
- **Provider**: OpenAI (configurable AI provider)
- **Speed**: ~5 seconds per resume (varies by model)
- **Accuracy**: Varies by model and prompt engineering
- **Continuous Learning**: Improve results by tuning prompts and validation

### How to Re-analyze
1. Open candidate modal
2. Go to "AI Analysis" tab
3. Click "Re-analyze" button
4. AI processes resume again
5. Updated scores and analysis display

---

## 📊 Pipeline Management

### Status Workflow
```
new → screening → interview → test → offer → hired
                        ↓
                     rejected
```

### Status Descriptions
| Status | Description |
|--------|-------------|
| **new** | Fresh application (default) |
| **screening** | Under AI/manual review |
| **interview** | Interview scheduled |
| **test** | Assessment in progress |
| **offer** | Offer extended to candidate |
| **hired** | Successfully hired |
| **rejected** | Application declined |

### Status Management
- **Bulk Update**: Change status in table quickly
- **Modal Update**: Detailed change with notes
- **Real-time Sync**: All users see updates instantly
- **Audit Trail**: Updated timestamps recorded

---

## 🔐 Security & Access Control

### Authentication
- **Supabase Auth**: Industry-standard security
- **Email Verification**: Optional email confirmation
- **Session Management**: Secure token handling
- **Password Requirements**: Strong password enforcement

### Database Security
- **Row Level Security (RLS)**: Role-based data access
- **Public Read**: Candidates can submit applications
- **Authenticated Access**: Only logged-in users see pipeline
- **Admin Controls**: Elevated privileges available

### API Security
- **CORS Protection**: Restricts cross-origin requests
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Server-side validation
- **XSS Prevention**: React's built-in protections

---

## 📱 Responsive Design

### Device Support
- **Desktop**: Full-featured interface
- **Tablet**: Optimized layout (portrait/landscape)
- **Mobile**: Single-column, touch-friendly
- **Large Screens**: Enhanced spacing and typography

### Features Across Devices
- **Mobile Tables**: Horizontal scroll on small screens
- **Responsive Modals**: Sized appropriately per device
- **Touch-friendly Buttons**: Larger tap targets
- **Readable Text**: Scaling font sizes

---

## 🎨 UI/UX Highlights

### Design System
- **Color Scheme**: Modern, accessible colors
- **Typography**: Clean, professional fonts
- **Spacing**: Consistent padding/margins
- **Icons**: Lucide React icons throughout

### Component Library
- **shadcn/ui**: High-quality React components
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Radix UI**: Accessible primitives

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Clear focus states

---

## 🔧 Technical Stack

### Frontend
- **React 18**: Latest React features
- **TypeScript**: Type safety
- **Vite**: Lightning-fast builds
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching & caching

### Backend
- **Supabase**: PostgreSQL database + auth
- **Edge Functions**: Serverless functions (Deno)
- **OpenAI**: AI analysis engine (configurable provider)

### Services
- **EmailJS**: Email delivery
- **Calendly**: Interview scheduling

### Styling
- **Tailwind CSS**: Utility CSS framework
- **PostCSS**: CSS processing
- **Design Tokens**: Centralized design system

---

## 📈 Future Enhancement Roadmap

### Planned Features
- [ ] Google Calendar API integration
- [ ] Bulk candidate import (CSV)
- [ ] Email templates builder
- [ ] Candidate scoring analytics
- [ ] Interview feedback forms
- [ ] Integration with LinkedIn profiles
- [ ] SMS notifications
- [ ] Dark mode toggle
- [ ] Export reports (PDF)
- [ ] Candidate pipeline chart

### Potential Integrations
- Google Workspace
- Microsoft 365
- Slack
- Discord
- Zapier

---

## 🚀 Performance Metrics

### Load Times
- **Landing Page**: <2 seconds
- **Dashboard**: <3 seconds
- **Candidate Modal**: <1 second
- **Email Send**: <2 seconds

### Database Queries
- **Indexed**: status, email, created_at
- **Optimized**: Real-time subscriptions
- **Paginated**: Scales to 10k+ candidates

### Bundle Size
- **Main Bundle**: ~765 KB (gzipped: ~229 KB)
- **Recommendation**: Code-split for <500 KB target

---

## 📞 Getting Help

### Documentation
- [Setup Guide](./SETUP_GUIDE.md)
- [README](./README.md)
- [GitHub Issues](https://github.com/CoderAnimeshSingh/HRFlow-AI/issues)

### Contact
- GitHub: [@CoderAnimeshSingh](https://github.com/CoderAnimeshSingh)

---

**Last Updated:** December 13, 2025  
**Version:** 1.0.0 (Production Ready)
