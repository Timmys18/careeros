# CareerOS MVP

**Know your true career value.**

CareerOS is a personal AI Career Agent — Bloomberg Terminal meets Spotify Wrapped for your professional life. Upload your resume, complete a short onboarding, and get an AI Career Report with market value, Career DNA, lost money analysis, dream path, resume roast, and shareable viral cards.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Radix/shadcn-style components
- **Backend:** Next.js Route Handlers, Prisma ORM, PostgreSQL
- **Auth:** Auth.js (NextAuth v5) with email/password credentials
- **AI:** OpenAI-compatible API (server-side only) with mock fallback
- **Payments:** Stripe (optional) with mock unlock in dev

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)

### 2. Install

```bash
cd careeros
npm install
```

### 3. Environment

```bash
cp .env.example .env
```

Edit `.env` with your `DATABASE_URL` and `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`).

### 4. Database

**Option A — Docker Postgres:**

```bash
docker run --name careeros-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=careeros -p 5432:5432 -d postgres:16
```

Set `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/careeros"`

**Option B — Prisma Postgres:**

```bash
npx create-db
```

### 5. Migrate & run

```bash
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Mock AI Mode

Set `ENABLE_MOCK_AI=true` explicitly, or leave `OPENAI_API_KEY` empty.

- No external AI calls
- Deterministic mock reports based on profile input
- Full product flow works without API key
- Dev banner shows when mock mode is active
- When an OpenAI key exists and `ENABLE_MOCK_AI` is false, CareerOS uses real AI.

## Real AI Mode

```env
ENABLE_MOCK_AI=false
OPENAI_API_KEY=sk-...
OPENAI_MODEL_REPORT=gpt-4o-mini
```

- All AI calls are **server-side only**
- One structured JSON call per report
- Zod validation on output
- Token/cost logged in `AiUsageLog`
- Rate limits and budget guardrails enforced

## Mock Payments

Set `ENABLE_MOCK_PAYMENTS=true` (default) or leave Stripe keys empty.

- Clicking "Upgrade to Pro" instantly unlocks Pro
- Redirects to dashboard with success message

## Stripe Mode

```env
ENABLE_MOCK_PAYMENTS=false
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
```

Configure webhook endpoint: `POST /api/stripe/webhook`

## Test Full Flow

1. **Landing** — `/`
2. **Demo report** (no signup) — `/demo`
3. **Start flow** — `/start` → upload/paste resume
4. **Onboarding** — `/onboarding` (12 questions)
5. **Sign up** — required before report generation
6. **Generating** — `/generating` → mock or real AI
7. **Report** — `/report/[id]`
8. **Share card** — `/share/[cardId]`
9. **Dashboard** — `/dashboard`
10. **Pricing / Pro** — `/pricing`

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/demo` | Alex Morgan demo report |
| `/start` | Resume upload/paste |
| `/onboarding` | Questionnaire |
| `/generating` | Loading + generation |
| `/report/[id]` | Full career report |
| `/dashboard` | User dashboard |
| `/cards` | All share cards |
| `/share/[id]` | Public share page |
| `/pricing` | Free / Pro / Executive |
| `/auth/signin` | Sign in / sign up |

## Environment Variables

See `.env.example` for full list including:

- `MAX_DAILY_REPORTS_PER_USER`, `MAX_DAILY_REPORTS_PER_IP`, `MAX_DAILY_REPORTS_GLOBAL`
- `MAX_DAILY_AI_COST_USD`, `MAX_MONTHLY_AI_COST_USD`
- `MAX_RESUME_CHARS`, `MAX_LINKEDIN_CHARS`

## Known Limitations (MVP)

- Report generation is synchronous (no job queue)
- File storage is local (`uploads/`) — S3/R2 abstraction ready to add
- Executive plan is waitlist only
- No LinkedIn scraping, job board, or auto-apply
- PNG card export not implemented (URL sharing only)
- Google OAuth not included (credentials auth only)

## Assumptions

- English-only UI for global B2C audience
- Free users: 1 report/day; Pro: 10/day
- Anonymous users can view demo but cannot generate real reports
- Salary outputs use ranges + confidence, never guarantees
- Public share pages expose only card content, never raw resume or full report

## Next Steps

- [ ] Background job queue for report generation
- [ ] S3/R2 file storage
- [ ] Google OAuth
- [ ] PNG/OG image generation for cards
- [ ] Executive tier + waitlist backend
- [ ] Email magic link auth
- [ ] Admin dashboard for AI cost monitoring

## License

Private — CareerOS MVP
