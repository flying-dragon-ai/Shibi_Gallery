# 师比画廊小程序 MVP 从 0 创建计划

## Context

本项目基于 `docs/师比画廊商业计划书.docx`，目标是创建一个“青年艺术家原作交易 + 版权授权居间”的微信小程序平台。商业计划书强调严选艺术家、作品鉴证、线上策展、明码标价、交易数据沉淀与版权合作线索。当前工作区基本为空，仅有 `docs/`，因此建议从 0 初始化 monorepo：小程序端负责用户浏览、收藏、下单和订单查看；Koa 后端负责 REST API、JWT 鉴权、PostgreSQL 数据、运营管理与测试。

GitHub 调研未发现完全匹配“uni-app + Koa + PostgreSQL + 艺术电商 + 版权居间”的单一开源项目，建议组合借鉴：`litemall` 的商城/订单闭环、`hello-uniapp` 的 uni-app 结构、`Strapi` 的内容/RBAC/媒体管理、`Medusa/Vendure/Saleor` 的商品订单模型、`Pretix` 的预约/场次/核销模型。只借鉴设计，不复制代码。

## 推荐架构

```text
D:/temp/世芳的项目/
├─ docs/
├─ apps/
│  ├─ mobile/                 # Vue 3 + TypeScript + uni-app + Pinia + SCSS
│  │  ├─ src/pages/
│  │  ├─ src/components/
│  │  ├─ src/stores/
│  │  ├─ src/api/
│  │  └─ src/styles/
│  └─ api/                    # Node.js + Koa + PostgreSQL + JWT + Vitest
│     ├─ src/config/
│     ├─ src/db/
│     ├─ src/middlewares/
│     ├─ src/modules/
│     ├─ src/routes/
│     └─ tests/
├─ packages/
│  └─ shared/                 # DTO、枚举、Zod schema、共享类型
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ .gitignore
└─ .env.example
```

## 初始化与依赖

优先使用 `pnpm` workspace。

- 根目录：`typescript`、`vitest`、`eslint`、`prettier`、`concurrently`。
- 前端：用 `dcloudio/uni-preset-vue#vite-ts` 初始化 `apps/mobile`，补充 `pinia`、`sass`、`@dcloudio/uni-ui`、`vue-tsc`。
- 后端：在 `apps/api` 初始化 TypeScript 项目，依赖 `koa`、`@koa/router`、`koa-bodyparser`、`@koa/cors`、`koa-helmet`、`jsonwebtoken`、`bcryptjs`、`pg`、`zod`、`dotenv`、`pino`、`uuid`、`tsx`、`supertest`。
- 数据库迁移：首版可用 SQL migration 文件，避免一开始引入重 ORM；后续再评估 Kysely/Drizzle/Prisma。

## 前端实施

### 页面

- `apps/mobile/src/pages/index/index.vue`：首页、当前策展、精选作品。
- `apps/mobile/src/pages/curations/list.vue`：策展列表。
- `apps/mobile/src/pages/curations/detail.vue`：策展详情、作品集合。
- `apps/mobile/src/pages/artworks/detail.vue`：作品详情、价格、证书、艺术家故事、版权合作入口。
- `apps/mobile/src/pages/artists/detail.vue`：艺术家主页、履历、作品列表。
- `apps/mobile/src/pages/favorites/index.vue`：我的收藏。
- `apps/mobile/src/pages/orders/create.vue`：确认订单。
- `apps/mobile/src/pages/orders/list.vue`、`apps/mobile/src/pages/orders/detail.vue`：订单列表和详情。
- `apps/mobile/src/pages/user/index.vue`：登录态、用户资料、订单入口。
- `apps/mobile/src/pages/admin/*`：首版轻量运营页面，受角色权限保护。

### 组件与状态

- 组件：`ArtworkCard`、`ArtistCard`、`CurationCard`、`PriceTag`、`CertificateBlock`、`OrderStatusBadge`、`LoginGuard`、`EmptyState`、`ImageGallery`。
- Pinia：`authStore`、`artworkStore`、`favoriteStore`、`orderStore`。
- API 封装：`apps/mobile/src/api/request.ts` 统一 baseURL、JWT header、401 处理；按模块拆分 `auth.ts`、`artworks.ts`、`artists.ts`、`curations.ts`、`favorites.ts`、`orders.ts`、`admin.ts`。

## 后端实施

### 模块

- `auth`：微信 `code` 登录、JWT 签发、用户资料。
- `users`：藏家、艺术家、运营角色。
- `artists`：艺术家资料、履历、审核状态。
- `artworks`：作品、图片、价格、售卖状态、版权授权信息。
- `curations`：线上策展专题与作品排序。
- `favorites`：收藏。
- `orders`：下单、订单状态机、已售保护。
- `certificates`：证书、鉴证信息。
- `admin`：运营 CRUD 与统计。
- `analytics`：浏览、收藏、购买、复购事件。

### 中间件

- `requestId`、`errorHandler`、`logger`。
- `authJwt`、`requireRole`。
- `validateBody`、`validateQuery`、`validateParams`。

### REST API

- `GET /api/health`
- `POST /api/auth/wechat-login`
- `GET /api/artworks`、`GET /api/artworks/:id`
- `GET /api/artists/:id`
- `GET /api/curations`、`GET /api/curations/:id`
- `POST /api/favorites/:artworkId`、`DELETE /api/favorites/:artworkId`、`GET /api/favorites/me`
- `POST /api/orders`、`GET /api/orders/me`、`GET /api/orders/:id`
- `POST /api/admin/artists`、`PATCH /api/admin/artists/:id`
- `POST /api/admin/artworks`、`PATCH /api/admin/artworks/:id`
- `POST /api/admin/curations`、`PATCH /api/admin/curations/:id`
- `PATCH /api/admin/orders/:id/status`

## PostgreSQL 初版表

- `users(id, openid, unionid, phone, nickname, avatar_url, role, created_at, updated_at)`
- `artists(id, user_id, name, bio, education, exhibitions, status, created_at, updated_at)`
- `artworks(id, artist_id, title, description, category, size, medium, year, price_cents, sale_status, copyright_status, created_at, updated_at)`
- `artwork_images(id, artwork_id, url, sort_order)`
- `curations(id, title, description, cover_url, status, starts_at, ends_at, created_at, updated_at)`
- `curation_artworks(curation_id, artwork_id, sort_order)`
- `favorites(user_id, artwork_id, created_at)`
- `orders(id, user_id, total_cents, status, receiver_name, receiver_phone, address, created_at, updated_at)`
- `order_items(id, order_id, artwork_id, price_cents)`
- `certificates(id, artwork_id, issuer, certificate_no, file_url, verified_at, created_at)`
- `analytics_events(id, user_id, event_type, target_type, target_id, created_at)`

关键约束：`users.openid unique`，`favorites(user_id, artwork_id) unique`，已售作品禁止重复下单，管理员接口必须校验 `role in ('admin', 'curator')`。

## 登录与鉴权

小程序端调用 `wx.login()` 获取 `code`，后端调用微信 `jscode2session` 换取 `openid/session_key`。首次登录自动创建 `users`，后续签发 JWT。JWT payload 包含 `sub`、`role`、`openid`，小程序本地持久化 token；请求时由 `apps/mobile/src/api/request.ts` 注入 `Authorization: Bearer <token>`；401 时重新登录。管理接口使用 `authJwt + requireRole`。

首版可先 mock 微信 code 换 openid，保留真实微信配置接口；接入真实 AppID/AppSecret 后替换实现。

## 实施顺序

1. 创建 monorepo、workspace、根 TypeScript/Vitest 配置。
2. 创建 `packages/shared`，定义枚举、DTO、Zod schema。
3. 搭建 Koa 应用：配置、健康检查、错误处理、日志、路由注册。
4. 创建 PostgreSQL schema migration 和 seed 数据。
5. 实现 `auth`、`artworks`、`artists`、`curations` 只读 API。
6. 初始化 uni-app 小程序端，实现首页、策展、作品详情、艺术家详情。
7. 实现收藏与订单 API、Pinia store、对应页面闭环。
8. 实现轻量运营管理页面和 admin REST API。
9. 加入 analytics 事件记录与简单统计接口。
10. 补测试、环境变量模板、README、启动脚本。

## 关键文件

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `packages/shared/src/index.ts`
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/db/pool.ts`
- `apps/api/src/db/migrations/001_initial_schema.sql`
- `apps/api/src/middlewares/auth.ts`
- `apps/api/src/modules/orders/order.service.ts`
- `apps/mobile/src/api/request.ts`
- `apps/mobile/src/stores/auth.ts`
- `apps/mobile/src/pages.json`
- `apps/mobile/src/pages/index/index.vue`

## 验证计划

- `pnpm test`：运行 workspace 测试。
- `pnpm --dir apps/api test`：Vitest + Supertest 覆盖登录、作品查询、收藏、下单、管理员权限。
- `pnpm --dir apps/mobile type-check`：前端类型检查。
- 数据库验证：重复收藏失败、已售作品重复下单失败、非管理员访问后台失败。
- 微信开发者工具手工验证：登录、首页浏览、作品详情、收藏、创建订单、订单查看。

## 风险与待确认

这些不阻塞首版骨架创建，但会影响上线能力：

- 是否首版必须接入真实微信支付；若是，订单状态和支付回调验签需要提前实现。
- 是否已有微信小程序 AppID、AppSecret、服务器域名与备案。
- 管理后台首版是小程序内简版，还是独立 Web Admin。
- 图片和证书文件存储方案：本地、腾讯云 COS 或 S3。
- 作品交易涉及鉴证、发票、物流保险、版权合同的合规细节。

## 默认假设

若用户无额外要求，执行阶段按以下假设推进：

- 使用 `pnpm`。
- 管理后台首版做小程序内受控页面，不额外创建 Web Admin。
- 微信登录先提供 mock + 真实接口占位，便于本地开发。
- 微信支付首版暂不接入真实支付，只完成订单创建和状态流转。
- 文件存储首版使用 URL 字段和 seed 图片，后续再接 COS/S3。
