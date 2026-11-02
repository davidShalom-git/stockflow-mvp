# StockFlow MVP

Minimal multi-tenant inventory management app built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Requirements

- Node.js 22.12 or newer
- npm
- PostgreSQL

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL connection string.
3. Generate Prisma Client with `npm run prisma:generate`.
4. Validate the data model with `npm run prisma:validate`.
5. Start the app with `npm run dev`.

Use `npm run prisma:migrate` when applying development migrations after the database is available.

## Checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
