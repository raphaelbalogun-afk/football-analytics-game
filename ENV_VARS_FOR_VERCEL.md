# Environment Variables for Vercel

Copy these into Vercel Dashboard → Your Project → Settings → Environment Variables:

## Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://msmpesahgevguiizimsi.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zbXBlc2FoZ2V2Z3VpaXppbXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNDY1ODIsImV4cCI6MjA4MjcyMjU4Mn0.e0NbT1tmMs2402-aM8UBDYeifK4-fawKnX5OPbd_MAI
```

```
API_FOOTBALL_KEY=50fffba51340e0b4987bba113fc2d0e9
```

```
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
```

```
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
```

**Note**: Replace `NEXT_PUBLIC_APP_URL` with your actual Vercel deployment URL after the first deployment.

## How to Add in Vercel

1. Go to https://vercel.com
2. Select your project
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Add each variable above
6. Select "Production", "Preview", and "Development" for each
7. Click "Save"
8. Redeploy your project

