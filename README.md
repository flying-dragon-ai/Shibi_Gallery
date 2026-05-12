# Shibi Gallery

Shibi Gallery（师比画廊）是一个面向青年艺术家的原作交易与版权授权居间微信小程序 MVP。项目覆盖艺术家展示、作品交易、线上策展、收藏、订单、鉴证证书、运营后台和基础数据统计。

## Tech Stack

- **Mobile**: Vue 3, TypeScript, uni-app, Pinia, SCSS, WeChat Mini Program
- **API**: Node.js, Koa, PostgreSQL, JWT, REST API, Pino
- **Shared**: TypeScript, Zod schemas, shared DTOs and domain types
- **Tooling**: pnpm workspace, Vite, Vitest, ESLint, Prettier, Docker Compose

## Project Structure

```text
.
├── apps/
│   ├── api/              # Koa REST API
│   └── mobile/           # uni-app WeChat Mini Program
├── packages/
│   └── shared/           # Shared types, DTOs, and Zod schemas
├── docs/                 # Product and implementation documents
├── docker-compose.yml    # Local PostgreSQL service
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root scripts
```

## Core Features

- Artist profiles and portfolio pages
- Artwork listing, detail pages, pricing, and certificate metadata
- Online curation topics and curation detail pages
- Favorites and user center
- Order creation, order list, and order detail flows
- Admin pages for operations management
- Analytics endpoints for operational dashboards
- Shared validation schemas across API and mobile code

## Requirements

- Node.js 20/22 LTS recommended. The current project can run on Node 24 with the provided compatibility flag in `pnpm dev:api`.
- pnpm `9.15.0` or compatible version
- Docker Desktop, if you want to run the local PostgreSQL service
- WeChat DevTools, for running the Mini Program output

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm db:setup
pnpm dev
```

The root `pnpm dev` command starts both services:

- API: `pnpm dev:api`
- Mobile Mini Program compiler: `pnpm dev:mobile`

You can also run them separately:

```bash
pnpm dev:api
pnpm dev:mobile
```

## Environment Variables

Create a local `.env` from `.env.example`:

```bash
cp .env.example .env
```

Important defaults:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/shibi_gallery
JWT_SECRET=replace-with-a-long-random-secret
MOCK_WECHAT_LOGIN=true
VITE_API_BASE_URL=http://localhost:3000/api
```

For real WeChat login, configure:

```env
WECHAT_APP_ID=
WECHAT_APP_SECRET=
```

## Database

Start local PostgreSQL:

```bash
pnpm db:up
```

Run migrations and seed data:

```bash
pnpm db:setup
```

Or run them separately:

```bash
pnpm db:migrate
pnpm db:seed
```

Database-related files:

- `docker-compose.yml`
- `apps/api/src/db/migrations/001_initial_schema.sql`
- `apps/api/src/db/seeds/dev.sql`
- `apps/api/src/db/migrate.ts`
- `apps/api/src/db/seed.ts`

## Running the Project

### API

Default API base URL:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

### WeChat Mini Program

Run the compiler:

```bash
pnpm dev:mobile
```

Then open WeChat DevTools and import this directory:

```text
apps/mobile/dist/dev/mp-weixin
```

For production build output, run:

```bash
pnpm --dir apps/mobile build
```

## Scripts

Root scripts:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start API and mobile compiler together |
| `pnpm dev:api` | Start the Koa API in watch mode |
| `pnpm dev:mobile` | Start uni-app WeChat Mini Program compiler |
| `pnpm db:up` | Start local PostgreSQL with Docker Compose |
| `pnpm db:migrate` | Run API database migrations |
| `pnpm db:seed` | Seed development data |
| `pnpm db:setup` | Run migrations and seed data |
| `pnpm build` | Build all workspace packages |
| `pnpm test` | Run tests across workspaces |
| `pnpm type-check` | Run TypeScript checks across workspaces |
| `pnpm lint` | Run lint checks across workspaces |

## API Modules

The API registers routes for:

- Health checks
- Authentication and mock WeChat login
- Artists
- Artworks
- Curations
- Favorites
- Orders
- Admin operations
- Analytics

Main entry points:

- `apps/api/src/server.ts`
- `apps/api/src/app.ts`
- `apps/api/src/modules/*`

## Mobile Pages

The Mini Program includes pages for:

- Home
- Curation list and curation detail
- Artwork detail
- Artist detail
- Favorites
- Order creation, list, and detail
- User center
- Admin dashboard and artwork management

Page configuration:

- `apps/mobile/src/pages.json`

## Validation

Run focused checks:

```bash
pnpm --dir apps/api type-check
pnpm --dir packages/shared type-check
```

Run full workspace checks:

```bash
pnpm type-check
pnpm test
pnpm lint
```

## Notes

- The Mini Program `appid` is empty by default. Configure it in `apps/mobile/src/manifest.json` before real-device or production use.
- Sass legacy JS API warnings may appear during uni-app compilation. They are warnings and do not block local development.
- On Node 24, the API uses `NODE_OPTIONS=--no-experimental-require-module` through `cross-env` to avoid dependency-chain compatibility issues. Node 20/22 LTS is recommended for a more stable development environment.
