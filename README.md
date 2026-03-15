# CampusAI — Intelligent Campus Issue Resolution

> AI-driven complaint management platform for modern universities.
> Every complaint. Classified. Prioritized. Resolved.

## Overview

CampusAI is a full-stack web application that automates student complaint management using Machine Learning. Students submit complaints, an ML model auto-classifies and prioritizes them, and admins resolve issues through an intelligent analytics dashboard.

## Features

- **AI Classification** — Automatically categorizes complaints into Network, Academic, Cleanliness, Hostel, Infrastructure, Admin
- **Priority Prediction** — ML model scores urgency using complaint frequency, category weight, and upvotes
- **AI Sentinel** — Real-time anomaly detection alerts for complaint spikes
- **Analytics Dashboard** — Trend charts, status breakdown, and next-week predictions
- **College Auth** — Appwrite-powered login restricted to college email domains
- **Upvote System** — Students upvote complaints, feeding directly into priority scoring
- **Weekly Reports** — Auto-generated PDF reports via ReportLab

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 14 | App Router, SSR |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Appwrite SDK | Auth |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI | REST API |
| SQLAlchemy 2.0 | ORM |
| PostgreSQL | Database |
| Alembic | Migrations |
| scikit-learn | ML classifier |
| spaCy | Text preprocessing |
| ReportLab | PDF generation |

## Project Structure
```
CampusAI/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login & Signup
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── landing/            # Hero, Navbar, Features
│   │   ├── dashboard/          # Shell, Widgets
│   │   └── ui/                 # Shared primitives
│   ├── hooks/                  # useActiveNav, useCyclingWord
│   ├── lib/                    # Appwrite, API helpers
│   └── types/                  # Shared interfaces
└── public/
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL

### Frontend Setup
```bash
git clone https://github.com/bhardwajparth51/CampusAI.git
cd CampusAI
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License
MIT
