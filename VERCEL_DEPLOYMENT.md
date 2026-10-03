# EditX Vault — Vercel Deployment Guide

## 1. Quick Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **"Add New..." > "Project"**.
2. Select your GitHub repository: `raghavdiya008-svg/web`.
3. Framework Preset: **Next.js** (auto-detected).
4. Root Directory: `./` (default).

---

## 2. Required Environment Variables
Add the following in your **Vercel Project Settings > Environment Variables**:

| Variable | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Your live Vercel domain | `https://your-project.vercel.app` |
| `NEXTAUTH_URL` | Auth callback base URL | `https://your-project.vercel.app` |
| `AUTH_SECRET` | 32-byte secret for NextAuth JWT | Run `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anonymous key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase private service key | `eyJhbGciOi...` |
| `DISCORD_CLIENT_ID` | Discord Developer Portal Application ID | `1538957...` |
| `DISCORD_CLIENT_SECRET` | Discord Developer Portal Secret | `xxxxxxx` |
| `DISCORD_SERVER_ID` | Guild ID for community verification | `1538957031455596544` |
| `DISCORD_INVITE_URL` | Community invite link | `https://discord.gg/mHAhsUYDtt` |
| `ENCRYPTION_KEY` | 32-character encryption key | Any secure 32-char string |
| `CRON_SECRET` | *(Optional)* Protect cron endpoints | Secret string |
| `RESEND_API_KEY` | *(Optional)* For transactional email | `re_xxxx...` |

---

## 3. Discord OAuth Configuration
In your [Discord Developer Portal](https://discord.com/developers/applications):
- Navigate to **OAuth2 > General**.
- Add the redirect URL:
  ```
  https://your-project.vercel.app/api/auth/callback/discord
  ```
  *(Also keep `http://localhost:3000/api/auth/callback/discord` for local dev).*

---

## 4. Vercel Cron Jobs
`vercel.json` contains automated hourly cron scheduling for `/api/cron/drop` to unlock daily canisters on schedule.
