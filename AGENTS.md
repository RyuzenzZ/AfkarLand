# AGENTS.md - AfkarGroupIndonesia
<!-- version: 1.1.0 -->
<!-- Last updated: 2026-05-25 -->

Last reviewed: 2026-05-25

Project: AfkarGroupIndonesia
App: AFKAR LAND
Environment: dev, Vercel production
Maintainer: repository maintainers

---

## Scope

| Boundary | Rule |
| --- | --- |
| Reads | `src/`, `public/`, `src/components/`, `src/pages/`, `src/hooks/`, `src/context/`, `src/services/`, `src/utils/`, `src/config/`, `.env.example`, `package.json`, `vite.config.js`, documentation files. |
| Writes | Only edit paths required by the current task. Keep diffs minimal. Update `package.json` and lockfile only when dependencies change. |
| Executes | `npm`, `npx`, `node` in project root. Use `vite`, `vercel`, and `firebase` CLI only for dev/build/deploy needs. |
| Off-limits | Real `.env` files, Firebase credentials outside approved config flow, production Firestore rules from terminal, destructive Firestore operations without explicit confirmation, and deletion of active admin routes without confirmation. |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI Framework | React 19 functional components and hooks |
| Styling | Tailwind CSS 4 with Vite plugin |
| Router | React Router DOM 7 |
| Backend/DB | Firebase Firestore 12 |
| Auth | Firebase Authentication |
| Icons | `react-icons/fi` and `lucide-react` |
| Toast | `react-hot-toast` |
| Animations | GSAP through internal adapter `src/lib/gsapMotion.jsx` |
| Build Tool | Vite 8 |
| Performance | `web-vitals`, sitemap/image optimization scripts |
| Charts | `recharts`, lazy loaded through route splitting where possible |

---

## Execution Sequence For Complex Tasks

For multi-step work, state these at the start:

1. The active rules from this file.
2. The current scope of files being read or edited.
3. The validation commands to run:
   - `npm run lint`
   - `npm run build`
   - `npm run dev` or local route check when visual behavior is affected
   - Manual browser check for new UI or animation changes

On long threads, the phrase "Remember: apply all AGENTS.md rules" refreshes these instructions.

---

## Context Budget

Use these references before editing:

- New reusable UI component: inspect `src/components/ui/` first.
- Firestore access: prefer `src/services/` or `src/hooks/`; avoid direct Firestore reads/writes inside page components unless the current codebase already uses that pattern and the change is tightly scoped.
- Routing: all app routes are defined in `src/App.jsx`.
- Animation and parallax: read `DESIGN.md` section "Sistem Animasi" before adding or changing animation patterns.
- Public theme and light/dark fixes: inspect `src/index.css`, `MainLayout`, and the affected public page before changing global overrides.

---

## Code Conventions

### Import Order

```jsx
// 1. React and hooks
// 2. Firebase imports
// 3. React Router
// 4. Internal UI/layout components
// 5. Icons from react-icons/fi or lucide-react
// 6. Utilities, hooks, services
// 7. Toast or other UI feedback helpers
```

### Naming

| Entity | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `NotifItem`, `ManageLeads` |
| Custom hooks | `use` + PascalCase | `useNotifications`, `useAuth` |
| Service functions | camelCase | `getLeads`, `updateBookingStatus` |
| Firestore collections | lowercase plural | `leads`, `messages`, `bookings` |
| Tailwind class groups | layout, spacing, color, effect | `flex items-center gap-3 px-4 py-2 bg-gray-900 rounded-xl` |

---

## Firestore Rules And Patterns

- Collections that are ordered by time must have `createdAt`.
- `notifRead` and `notifHidden` are the notification soft-delete pattern.
- Do not hard-delete notifications; use `notifHidden: true`.
- Use `writeBatch` for atomic multi-document updates.
- Firestore batch limit is 500 operations. Split large operations into multiple batches.
- Wrap realtime `onSnapshot` listeners in `useEffect` and clean up with `unsubscribe`.
- Use named Firebase imports for tree-shaking. Do not use `import *` from Firebase packages.

---

## Always Do

- Check existing components in `src/components/ui/` before creating new reusable UI.
- Use `react-hot-toast` for user action feedback.
- Keep route changes intentional and documented.
- Use Tailwind utility classes. Inline styles are allowed only for dynamic values that Tailwind cannot express cleanly.
- Respect dark/light theme behavior on public pages.
- Keep animation purposeful, short, and GPU-friendly.
- Validate with `npm run lint` and `npm run build` after code changes.
- Keep `.env` and production secrets out of Git.

## Never Do

- Do not read, print, commit, or hardcode real `.env` secrets.
- Do not edit Firebase credentials outside the approved environment-variable flow.
- Do not add another animation library without discussion; GSAP is the official animation layer.
- Do not delete active admin routes without maintainer confirmation.
- Do not duplicate components under different paths with the same purpose.
- Do not introduce heavy parallax or scroll effects on mobile/tablet without a reduced-motion and performance strategy.
- Do not run destructive Firestore or filesystem operations unless explicitly requested.

---

## Public Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/tentang-kami` | About |
| `/karir` | Career |
| `/proyek` | Projects |
| `/proyek/:slug` | Project detail |
| `/artikel` | Blog |
| `/artikel/:slug` | Blog detail |
| `/kontak` | Contact |
| `/faq` | FAQ |
| `*` | Not found |

---

## Admin Routes

All `/admin/*` routes must stay protected by the admin auth guard in `AdminLayout`.

| Path | Page | Notes |
| --- | --- | --- |
| `/admin/login` | Login | Public login screen for admins only. |
| `/admin/dashboard` | Dashboard | Website monitoring center. |
| `/admin/notifications` | ManageNotifications | Realtime notification center. |
| `/admin/homepage` | ManageHomepage | Public website CMS and page content. |
| `/admin/projects` | ManageProjects | Public project content and project detail data. |
| `/admin/articles` | ManageArticles | Article/blog CMS. |
| `/admin/gallery` | ManageGallery | Public media gallery. |
| `/admin/testimonials` | ManageTestimonials | Public testimonial content. |
| `/admin/services` | ManageServices | Public service content. |
| `/admin/leads` | ManageLeads | Transitional module; should move to internal portal later. |
| `/admin/messages` | ManageMessages | Transitional module; should move to internal portal later. |
| `/admin/applications` | ManageApplications | Transitional module; should move to HRD portal later. |
| `/admin/siteplan` | ManageSiteplan | Transitional module; project operations should move to portal later. |
| `/admin/finance` | ManageFinance | Transitional module; finance should move to portal later. |
| `/admin/performance` | ManagePerformance | Transitional module; team KPI should move to portal later. |
| `/admin/seo` | ManageSEO | SEO, metadata, Search Console, Analytics/GTM config. |
| `/admin/analytics` | ManageAnalytics | Public website analytics and Web Vitals monitoring. |
| `/admin/settings` | Settings | Public website settings. |

---

## Portal Split Direction

Main admin remains focused on the public website:

- Homepage and public page CMS.
- Public project content.
- Articles, gallery, testimonials, services.
- SEO manager.
- Website analytics and Web Vitals.
- Public website settings.

Internal portal should own operational modules:

- CRM, leads, messages, marketing tools.
- HRD applications and employee workflows.
- Siteplan operations and project progress.
- Finance reports and approvals.
- Team performance and executive dashboards.

Recommended public link target: `VITE_TEAM_PORTAL_URL`, defaulting to `https://portal.afkarland.com`.

---

## Assets, SEO, And Performance

- Use optimized public images where possible: WebP/AVIF and responsive sizing.
- Keep `scripts/generate-sitemap.mjs` and `scripts/optimize-images.mjs` aligned with public routes and assets.
- Sitemap and robots generation should run before production build.
- Web Vitals tracking should cover LCP, CLS, and INP.
- Avoid duplicate tracking between Google Analytics and GTM; define one primary tracking provider.
- Lazy-load charts/admin-heavy pages through route splitting.

---

## Repo Reference

```text
AfkarGroupIndonesia/
|-- public/
|   |-- images/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- layout/
|   |   |-- ui/
|   |-- config/
|   |   |-- firebaseConfig.js
|   |-- context/
|   |-- hooks/
|   |-- lib/
|   |   |-- analytics.js
|   |   |-- gsapMotion.jsx
|   |-- pages/
|   |   |-- admin/
|   |-- services/
|   |-- utils/
|-- .env.example
|-- package.json
|-- vite.config.js
```

---

## Running Services

```bash
npm run dev
npm run lint
npm run build
npm run preview
firebase deploy
```

---

## Gotchas

- Vercel production requires Firebase `VITE_*` environment variables to be configured in Project Settings.
- Firebase Auth must include the deployed domain in Authorized Domains.
- `framer-motion` imports are intentionally resolved through the internal GSAP adapter.
- Broad light-mode overrides live in `src/index.css`; test public pages after changing them.
- Too many `will-change: transform` elements can hurt mobile performance.
- Route-level lazy loading already exists in `App.jsx`; do not undo it.

---

## Changelog

| Date | Version | Changes |
| --- | --- | --- |
| 2026-05-22 | 1.0.0 | Initial documentation for React/Firebase/Tailwind app, Firestore conventions, admin routes, and animation guidance. |
| 2026-05-25 | 1.1.0 | Updated stack versions, cleaned encoding, refreshed route list, added portal split direction, and documented SEO/performance build flow. |
