# HabitFlow — Deployment Guide

## Step 1 — Set up Supabase (5 min)

1. Go to supabase.com → New project (choose a region close to you)
2. Wait for the project to provision (~2 min)
3. Go to **SQL Editor** → **New query**
4. Paste the entire contents of `supabase/schema.sql` and click **Run**
5. Go to **Project Settings** → **API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

> Keep the service_role key secret — it bypasses all RLS policies.

### Make yourself admin

After you first sign up in the app, run this in the Supabase SQL Editor:

```sql
select promote_to_admin('your@email.com');
```

---

## Step 2 — Deploy to Vercel (5 min)

### Option A: Deploy via GitHub (recommended)

1. Push this repo to GitHub:
   ```bash
   cd habitflow
   git init
   git add -A
   git commit -m "initial commit"
   gh repo create habitflow --public --push --source=.
   ```

2. Go to vercel.com → **New Project** → Import from GitHub
3. Select the `habitflow` repo
4. Add Environment Variables (from Step 1):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts, then set env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod
```

---

## Step 3 — Connect your domain (Cloudflare)

### In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Add your domain e.g. `habits.yourdomain.com`
3. Vercel will show you a CNAME record to add

### In Cloudflare:
1. Go to your domain → **DNS** → **Add record**
   ```
   Type:    CNAME
   Name:    habits          (or @ for root domain)
   Target:  cname.vercel-dns.com
   Proxy:   ON (orange cloud) ← this enables Cloudflare protection
   ```
2. Back in Vercel, click **Verify** — it may take a few minutes

### Cloudflare SSL settings:
- Go to **SSL/TLS** → set to **Full (strict)**
- This ensures end-to-end encryption between Cloudflare ↔ Vercel

---

## Step 4 — Supabase auth redirect URLs

Supabase needs to know your production URL for email confirmation links.

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://habits.yourdomain.com`
3. Add to **Redirect URLs**: `https://habits.yourdomain.com/**`

---

## Optional: Cloudflare WAF / Bot protection

- **Turnstile** (bot protection on forms): free at dash.cloudflare.com/turnstile
- **Rate limiting**: Cloudflare free plan includes 5 rate limit rules
- **WAF**: available on Cloudflare Pro ($20/month) if needed later

---

## Local development

```bash
# Copy env template
cp .env.local.example .env.local
# Fill in your Supabase keys, then:
npm run dev
# App runs at http://localhost:3000
```
