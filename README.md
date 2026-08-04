# Robotics Club Competition Management Platform

A full-stack Next.js application built for robotics clubs to manage their internal competitions, juries, and scoring criteria.

## Tech Stack
- **Next.js 14+** (App Router)
- **Supabase** (Database, Auth, Row Level Security)
- **Tailwind CSS** & **shadcn/ui**
- **TypeScript**

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
Make sure you have Docker installed and running.
```bash
npx supabase start
npx supabase db push
```
Or, to apply the seed data (which creates the first admin user):
```bash
npx supabase db reset
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials. If you're running Supabase locally, the CLI will output these values when you run `npx supabase start`.
```bash
cp .env.example .env.local
```

### 4. Run the App
```bash
npm run dev
```

## First Admin User
The `supabase/seed.sql` script creates an initial admin user with:
- **Username:** `admin`
- **Password:** `admin123`

## Deployment (Vercel)
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Link the Vercel project to your Supabase project using the Supabase integration or manually setting the Environment Variables in Vercel.
4. Set the `CLUB_SLUG` environment variable.
