# Installation — Ground Floor Studio

## Requirements

- **Node.js 18+** — check with `node -v`
- **npm** — comes with Node

---

## Step 1 — Unzip the project

```bash
unzip ground-floor.zip
cd ground-floor
```

---

## Step 2 — Install dependencies

```bash
npm install
```

This installs Next.js, Prisma, Tailwind, date-fns, lucide-react, and everything else.

---

## Step 3 — Set up the database

```bash
# Copy the environment file
cp .env.example .env

# Create the SQLite database and push the schema
npm run db:push
```

This creates a `prisma/dev.db` file locally. No external database needed.

---

## Step 4 — Seed with example data (optional)

```bash
npm run db:seed
```

This creates 5 sample walks including Walk 2 (Le jardin fermé) with the full script already written.

---

## Step 5 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What you get

| URL | What it is |
|-----|-----------|
| `localhost:3000` | Kanban board — all walks, drag & drop |
| `localhost:3000/walks/[id]` | Walk detail — metadata + script editor |
| `localhost:3000/calendar` | Monthly calendar — recording & publish dates |

---

## Database management

```bash
# Visual database browser (Prisma Studio)
npm run db:studio
# Opens at http://localhost:5555

# Reset and re-seed
npm run db:push --force-reset
npm run db:seed
```

---

## Production deploy on Vercel

### 1. Switch to PostgreSQL

In `prisma/schema.prisma`, change:
```
provider = "sqlite"
```
to:
```
provider = "postgresql"
```

### 2. Create a PostgreSQL database

Options (all have free tier):
- [Neon](https://neon.tech) — recommended
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [Supabase](https://supabase.com)

Copy the connection string (`postgresql://...`).

### 3. Deploy

```bash
# Push to GitHub
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USER/ground-floor.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com):
1. Import the GitHub repo
2. Add environment variable: `DATABASE_URL` = your PostgreSQL connection string
3. Deploy

Vercel runs `prisma generate && prisma db push && next build` automatically (configured in `vercel.json`).

---

## Project structure

```
ground-floor/
├── prisma/
│   ├── schema.prisma       ← Database schema (Walk + Script models)
│   └── seed.ts             ← Sample data
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Kanban dashboard
│   │   ├── walks/[id]/page.tsx         ← Walk detail + script editor
│   │   ├── calendar/page.tsx           ← Calendar view
│   │   └── api/
│   │       ├── walks/route.ts          ← GET all, POST new walk
│   │       ├── walks/[id]/route.ts     ← GET, PATCH, DELETE walk
│   │       └── scripts/[walkId]/route.ts ← PATCH script (auto-save)
│   ├── components/
│   │   ├── KanbanBoard.tsx     ← Drag & drop board
│   │   ├── MetaPanel.tsx       ← Walk metadata (left panel)
│   │   ├── ScriptEditor.tsx    ← 5-phase writing tool (right panel)
│   │   ├── CalendarView.tsx    ← Monthly calendar
│   │   ├── Sidebar.tsx         ← Navigation
│   │   ├── StatusBadge.tsx     ← Status pill
│   │   └── NewWalkDialog.tsx   ← Create walk modal
│   └── lib/
│       ├── db.ts           ← Prisma singleton
│       ├── types.ts        ← Shared types, status config, script phases
│       └── utils.ts        ← cn() helper
├── .env.example            ← Copy to .env
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Troubleshooting

**`Cannot find module '@prisma/client'`**
```bash
npx prisma generate
```

**`The table Walk does not exist`**
```bash
npm run db:push
```

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

**Fonts not loading**
Needs internet connection on first run (Google Fonts). Works offline after first load.
