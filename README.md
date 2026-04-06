# BioGrader

**Live app:** [bio-grader.vercel.app](https://bio-grader.vercel.app)

AI-powered AP Biology FRQ practice and grading — built so students never have to wait until the weekend before the exam to get feedback.

## Origin

Every year before AP exams, my biology teacher would get flooded with requests from students asking her to grade their free response practice answers over the weekend. It was too much for one teacher to handle, and students were left without feedback at the most critical time.

A year ago I built a personal script to grade my own FRQs using an AI model. It worked well enough that I decided to turn it into something more formal — a full web app that any AP Biology student (or teacher) can use year-round.

## What It Does

- **FRQ Practice** — A library of AP Biology free response questions spanning all 8 units and multiple exam years
- **AI Grading** — Answers are graded by Claude against the official College Board rubric, with per-criterion feedback and point breakdowns
- **MCQ Practice** — Multiple choice questions with instant feedback, tracked by unit
- **Progress Tracking** — Dashboard with score trends, accuracy charts, and per-unit breakdowns
- **Teacher Accounts** — Teachers can view per-student stats, MCQ accuracy, and FRQ submission history
- **Import Questions** — Teachers and admins can add FRQ and MCQ questions via form or CSV bulk upload

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Auth | NextAuth.js |
| AI | Anthropic Claude API |
| UI | Tailwind CSS v4, Radix UI, shadcn/ui |
| Hosting | Vercel |

## Running Locally

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/aghosal1317/BioGrader.git
   cd BioGrader
   npm install
   ```

2. Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `DATABASE_URL` + `DIRECT_URL` — PostgreSQL connection strings (e.g. from Supabase)
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev
   - `NEXTAUTH_SECRET` — any random secret string
   - `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
   - `EMAIL_*` — SMTP credentials for password reset emails (e.g. Resend)

3. Push the database schema and seed sample questions:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Made By

Aneesh Ghosal
