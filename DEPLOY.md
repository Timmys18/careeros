# CareerOS — Production Deployment

Deploy-ready checklist for Vercel + managed PostgreSQL.

## 1. Database (required)

Use **Neon**, **Supabase**, or **Railway** PostgreSQL:

```env
DATABASE_URL="postgresql://user:pass@host:5432/careeros?sslmode=require"
```

Run migrations once:

```bash
npx prisma migrate deploy
```

Or on first deploy: `npx prisma db push`

## 2. Environment variables (Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | `https://yourdomain.com` |
| `APP_URL` | Yes | Same as NEXTAUTH_URL |
| `ENABLE_MOCK_AI` | Prod | Set `false` when OpenAI key present |
| `ENABLE_MOCK_PAYMENTS` | Prod | Set `false` when Stripe configured |
| `OPENAI_API_KEY` | Prod AI | Server-side only |
| `STRIPE_SECRET_KEY` | Payments | Optional until launch |
| `STRIPE_WEBHOOK_SECRET` | Payments | `/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY` | Payments | Stripe Price ID |

## 3. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect GitHub repo → Import → set env vars → Deploy.

Build command (default from `vercel.json`):
```
prisma generate && prisma migrate deploy && next build
```

## 4. Post-deploy

1. Hit `GET /api/health` — should return `{ status: "ok" }`
2. Test `/demo` — static demo, no DB write
3. Register → generate report → verify `/report/[id]`
4. Configure Stripe webhook: `https://yourdomain.com/api/stripe/webhook`

## 5. File uploads (production)

MVP uses local `uploads/` — **not suitable for serverless**.

For production, add S3/R2 storage adapter in `lib/upload.ts` before scaling.

Users can always paste text as fallback.

## 6. What's production-ready

- Security headers (next.config)
- Health check endpoint
- Env validation (`lib/env.ts`)
- Auth with `trustHost` for Vercel
- Prisma migrations support
- Mock modes disabled in production when keys set
- Error / 404 / loading states
- SEO metadata + Open Graph

## 7. Before public launch

- [ ] Set real `NEXTAUTH_SECRET`
- [ ] Disable mock AI / payments
- [ ] Add OpenAI key + budget limits
- [ ] Configure Stripe live mode
- [ ] Replace `metadataBase` domain in `app/layout.tsx`
- [ ] Add S3 for file uploads (optional — paste works)
- [ ] Set up monitoring on `/api/health`
