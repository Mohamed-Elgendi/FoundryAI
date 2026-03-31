# FoundryAI Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account with project created
- Stripe account (for payments)
- Vercel account (for hosting)
- Sentry account (optional, for error tracking)
- PostHog account (optional, for analytics)

## Environment Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all required environment variables in `.env.local`

### Required Environment Variables

#### Supabase (Required)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

#### AI Providers (At least one required)
- `GROQ_API_KEY` - Groq API key (fastest, recommended)
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_AI_API_KEY` - Google AI API key
- `MISTRAL_API_KEY` - Mistral API key
- `DEEPSEEK_API_KEY` - DeepSeek API key
- `XAI_API_KEY` - xAI API key

#### Stripe (Required for payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (for local dev: run `stripe listen`)

#### Monitoring & Analytics (Optional)
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN for error tracking
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key for analytics

## Database Setup

1. Run Supabase migrations:
   ```bash
   npx supabase migration up
   ```

2. Verify tables are created in Supabase dashboard

3. Enable Row Level Security (RLS) policies are active

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000

## Production Deployment

### Option 1: Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with `git push` to main branch

### Option 2: Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Stripe Webhook Setup

### Local Development

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Production

1. Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/webhooks/stripe`
2. Select events: `checkout.session.completed`, `customer.subscription.updated`, etc.
3. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Post-Deployment Checklist

- [ ] Environment variables configured in hosting platform
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] Supabase RLS policies active
- [ ] Error tracking (Sentry) working
- [ ] Analytics (PostHog) receiving events
- [ ] API routes responding correctly
- [ ] Static assets loading properly
- [ ] Build successful with no errors

## Monitoring

### Health Checks

Check these endpoints after deployment:
- `GET /` - Homepage loads
- `GET /api/providers` - Returns AI provider list
- `POST /api/generate` - Plan generation works

### Error Tracking

View errors in Sentry dashboard:
- Production: https://sentry.io/your-project
- Filter by `environment:production`

### Analytics

View events in PostHog:
- https://app.posthog.com/project/your-project

## Troubleshooting

### Build Failures

1. Check TypeScript errors: `npx tsc --noEmit`
2. Check for missing environment variables
3. Verify all imports resolve correctly

### Database Issues

1. Verify Supabase URL and keys are correct
2. Check RLS policies allow operations
3. Review connection limits

### AI Provider Errors

1. Verify API keys are valid
2. Check provider status pages
3. Review rate limits

### Stripe Issues

1. Verify webhook secret matches
2. Check Stripe dashboard for failed events
3. Ensure endpoint returns 200 for valid requests

## Rollback Procedure

1. Revert to previous commit: `git revert HEAD`
2. Re-deploy via CI/CD
3. Monitor error rates in Sentry

## Support

For deployment issues, check:
- DEPLOYMENT_ISSUES_LOG.md
- Vercel logs
- Sentry error reports
