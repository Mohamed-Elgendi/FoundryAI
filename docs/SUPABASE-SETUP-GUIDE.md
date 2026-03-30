# Supabase Setup Guide for FoundryAI

## Quick Setup (10 minutes)

### Step 1: Create Supabase Projects (Manual - Required)

**You must do this manually via Supabase Dashboard:**

1. Go to https://supabase.com/dashboard
2. Sign in with your account
3. Create **Production** project:
   - Name: `foundryai-production`
   - Region: Choose closest to your users (e.g., `us-east-1` for US, `eu-west-1` for EU)
   - Save the database password securely (1Password/Bitwarden)
4. Create **Staging** project:
   - Name: `foundryai-staging`
   - Same region as production
   - Different password

### Step 2: Get API Keys (From Supabase Dashboard)

For EACH project, go to Project Settings → API:

**Copy these values:**
- `Project URL` (e.g., `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`)
- `anon public` key
- `service_role secret` key (⚠️ Keep this SECRET)

### Step 3: Configure Local Environment

**Copy `.env.example` to `.env.local` and fill in your real keys:**

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual Supabase keys.

### Step 4: Test Connection

```bash
npm run test:supabase
```

Should output: ✅ "Supabase connection successful"

---

## Post-Setup: Database Migrations

After Supabase is connected, run migrations:

```bash
# Install Supabase CLI if not already
npm install -g supabase

# Login to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

---

## Troubleshooting

### Connection Failed
- Check `.env.local` has correct values
- Ensure no extra spaces or quotes around keys
- Verify project is active in Supabase dashboard

### RLS Not Working
- Migrations must be applied first
- Check `supabase/migrations/` folder exists
- Run `supabase db push` to apply

### Environment Variables Not Loading
- Make sure `.env.local` is in project root
- Restart Next.js dev server after changes
- Check file is not `.env.local.txt` (Windows issue)

---

## Security Checklist

- [ ] `.env.local` added to `.gitignore`
- [ ] Service role key NEVER exposed to frontend
- [ ] Database password stored in password manager
- [ ] Staging and production have different credentials
- [ ] RLS policies enabled before any real data

---

**Next after this setup:** Step 1.2 — Database Schema Implementation
