# Ground Floor — Studio

A focused tool to create, manage and produce geolocated audio walks.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom editorial palette)
- **Prisma ORM** + SQLite (dev) / PostgreSQL (prod)
- **Vercel-ready**

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Push schema to SQLite
npm run db:push

# 4. Seed with sample walks
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production (Vercel + PostgreSQL)

1. Create a PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.)
2. Update `.env` with your `DATABASE_URL` (postgresql://...)
3. Update `prisma/schema.prisma`: change `provider = "sqlite"` → `provider = "postgresql"`
4. Push to GitHub and deploy on Vercel
5. Add `DATABASE_URL` to Vercel environment variables

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Kanban dashboard
│   ├── walks/[id]/page.tsx   # Walk detail + script editor
│   ├── calendar/page.tsx     # Monthly calendar
│   └── api/
│       ├── walks/            # CRUD walks
│       └── scripts/[walkId]/ # Auto-save scripts
├── components/
│   ├── Sidebar.tsx           # Navigation
│   ├── KanbanBoard.tsx       # Drag & drop board
│   ├── MetaPanel.tsx         # Walk metadata (left panel)
│   ├── ScriptEditor.tsx      # 5-phase writing tool (right panel)
│   ├── CalendarView.tsx      # Monthly calendar
│   ├── StatusBadge.tsx       # Status pill
│   └── NewWalkDialog.tsx     # Create walk modal
└── lib/
    ├── db.ts                 # Prisma singleton
    ├── types.ts              # Types, constants, utilities
    └── utils.ts              # cn() helper
```

## Script structure

Each walk has a script divided into 5 editorial phases:

| Phase | Purpose |
|-------|---------|
| **Arrival** | Situate the listener in space |
| **Observation** | Teach them how to look |
| **Discovery** | Reveal something hidden |
| **Expansion** | Connect to broader context |
| **Reframing** | Shift perception |

Each phase has: text editor · speaker field · production notes · live word count + audio estimate.

## Walk statuses

`Idea` → `En desarrollo` → `Grabado` → `Editado` → `Publicado`

Drag & drop between columns on the kanban board.
