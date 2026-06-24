# 🚀 KẾ HOẠCH TRIỂN KHAI: WEBSITE XEM PHIM GIA ĐÌNH

> **Phiên bản:** 1.1 | **Ngày:** 24/06/2026 | **Quy trình:** Agile Scrum (2-tuần Sprint)

---

## 1. TỔ CHỨC TEAM — AI AGENT ROLES

### 1.1 Sơ Đồ Team

```
┌─────────────────────────────────────────────────────────────────┐
│                    🏆 TEAM PHÁT TRIỂN                          │
│                                                                 │
│  ┌─────────────┐                                               │
│  │  🧑‍💼 LEADER  │  ← Điều phối, review, merge code, release    │
│  └──────┬──────┘                                               │
│         │ Assign tasks & review                                 │
│    ┌────▼────────────────────────────────┐                     │
│    │         SPRINT BACKLOG              │                     │
│    └────┬──────────┬──────────┬──────────┘                     │
│    ┌────▼────┐ ┌───▼────┐ ┌──▼─────┐                          │
│    │ 🔧 BE   │ │ 🎨 FE  │ │ 🧪 QA  │  ← Hoạt động song song  │
│    │ Dev     │ │ Dev    │ │ Auto   │                          │
│    └─────────┘ └────────┘ └────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Mô Tả Vai Trò

#### 🧑‍💼 Leader (Tech Lead / Project Manager)
**Trách nhiệm:**
- Phân tích yêu cầu, breakdown tasks vào Sprint Backlog.
- Setup project: repository, Vercel, Supabase, CI/CD pipeline.
- Thiết kế kiến trúc tổng thể và quyết định kỹ thuật.
- Code review tất cả Pull Request trước khi merge.
- Quản lý Daily Standup (15 phút/ngày).
- Điều phối conflict giữa BE và FE.
- Quản lý release và deployment.
- Viết và duy trì README, documentation.

**Quyết định phụ trách:**
- Chọn thư viện kỹ thuật.
- Quy ước đặt tên, cấu trúc folder.
- Git branching strategy.
- Definition of Done (DoD).

---

#### 🔧 Back-end Developer
**Trách nhiệm:**
- Thiết kế và implement API Routes của Next.js.
- Tích hợp Supabase Auth (signUp, signIn, signOut, session).
- Viết Supabase schema, migrations, RLS policies.
- Implement proxy layer cho phimapi.com.
- Caching strategy (ISR, Next.js cache headers).
- Middleware bảo vệ route.
- TypeScript types cho API responses.
- Error handling và logging.

**Tech stack phụ trách:**
- Next.js API Routes (`/app/api/...`)
- `@supabase/ssr` server-side client
- Supabase Database & Auth
- Next.js middleware

---

#### 🎨 Front-end Developer
**Trách nhiệm:**
- Implement UI theo design system (Tailwind + shadcn/ui).
- Xây dựng tất cả pages và components.
- Tích hợp Supabase client-side (Auth forms).
- Gọi API và hiển thị dữ liệu phim.
- Video player component (hls.js / iframe embed).
- Responsive design (mobile-first).
- Dark mode support.
- Loading states, skeleton, error boundaries.
- Performance: lazy loading ảnh, code splitting.

**Tech stack phụ trách:**
- Next.js App Router (pages, layouts)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (data fetching)
- hls.js (video player)
- `@supabase/ssr` client-side

---

#### 🧪 QA (Quality Assurance — Automation & Unit Test)
**Trách nhiệm:**
- Viết unit test song song với development.
- Viết automation E2E test cho user flows quan trọng.
- Test plan và test cases document.
- Bug report và tracking.
- Regression testing trước mỗi release.
- Performance testing (Lighthouse CI).

**Tech stack phụ trách:**
- **Unit Test:** Vitest + React Testing Library
- **E2E Test:** Playwright
- **Lighthouse CI:** Kiểm tra Core Web Vitals
- **GitHub Actions:** Chạy test tự động trên mỗi PR

---

## 2. QUY TRÌNH PHÁT TRIỂN — AGILE SCRUM

### 2.1 Cấu Trúc Sprint

```
Sprint 0 (Setup)     → 3 ngày
Sprint 1 (Auth)      → 7 ngày
Sprint 2 (Core)      → 7 ngày
Sprint 3 (Player)    → 7 ngày
Sprint 4 (Polish)    → 5 ngày
─────────────────────────────
Tổng:                → ~29 ngày (~4-5 tuần)
```

### 2.2 Quy Trình Hàng Ngày

```
08:00 - Daily Standup (15 phút, tất cả role)
         ├─ Hôm qua làm gì?
         ├─ Hôm nay làm gì?
         └─ Blocker nào cần giải quyết?

08:15 - Làm việc độc lập theo lane:
         BE ─────────── Feature branch
         FE ─────────── Feature branch  (song song BE)
         QA ─────────── Viết test cho feature đang dev

End of Day - PR Review + Merge
```

### 2.3 Git Branching Strategy (GitHub Flow)

```
main
 ├─ develop           ← Integration branch
 │   ├─ feature/auth-register    (BE)
 │   ├─ feature/auth-ui          (FE)
 │   ├─ feature/movie-api        (BE)
 │   ├─ feature/home-page        (FE)
 │   └─ test/e2e-auth            (QA)
 └─ release/v1.0      ← Stable release
```

**Quy tắc:**
- Không commit thẳng vào `main` hay `develop`.
- PR phải được Leader review trước khi merge.
- CI/CD chạy test tự động trên mọi PR.
- Squash merge để giữ history sạch.

### 2.4 Definition of Done (DoD)

Một task được coi là **hoàn thành** khi:
- ✅ Code implement đúng yêu cầu.
- ✅ Unit test coverage ≥ 80% cho logic quan trọng.
- ✅ Không có TypeScript error.
- ✅ Responsive: mobile, tablet, desktop.
- ✅ Đã Pass E2E test liên quan (nếu có).
- ✅ Leader review và approve PR.
- ✅ Deploy thành công lên Vercel preview.

---

## 3. KẾ HOẠCH CHI TIẾT THEO SPRINT

---

### 1.3 Solo Developer Path

> Dành cho trường hợp **1 người** (hoặc 1 AI agent) implement toàn bộ dự án.
> Thứ tự ưu tiên theo track thắng đứng (không song song):

```
Giai đoạn 1 — Setup (1-2 ngày)
  ├─ Tạo Next.js project + cài dependencies
  ├─ Setup Supabase (schema, trigger, RLS)
  └─ Cấu hình Vercel + env variables

Giai đoạn 2 — Core Backend (1-2 ngày)
  ├─ Supabase auth helpers (client, server, middleware)
  ├─ KKPhim API proxy functions
  └─ Verify response structure (thực tế, không giả định)

Giai đoạn 3 — Authentication UI (1 ngày)
  ├─ Trang đăng ký + đăng nhập
  └─ Test đăng ký → đăng nhập → đăng xuất thành công

Giai đoạn 4 — Core Pages (2-3 ngày)
  ├─ Layout (Header, Footer)
  ├─ Trang chủ → danh sách → chi tiết
  └─ Tìm kiếm + lọc theo thể loại/quốc gia

Giai đoạn 5 — Video Player (1-2 ngày)
  ├─ Player cơ bản (embed iframe)
  └─ HLS fallback + chọn tập/server

Giai đoạn 6 — Polish (1 ngày)
  ├─ 404 page, error boundary, loading states
  └─ SEO meta tags, responsive check

Tổng: ~8-11 ngày (solo, tập trung)
```

---

### 🏁 SPRINT 0: PROJECT SETUP (3 ngày)

**Mục tiêu:** Toàn bộ infrastructure sẵn sàng, team có thể bắt đầu code.

#### Leader Tasks
| Task | Thời gian | Mô tả |
|---|---|---|
| Tạo GitHub repo | 1h | Monorepo, thiết lập `.gitignore`, branch rules |
| Setup Next.js 14 | 2h | `npx create-next-app@latest`, cấu hình TypeScript, Tailwind, App Router |
| Cấu hình Supabase | 2h | Tạo project free, lấy credentials, cài `@supabase/ssr` |
| Cấu hình Vercel | 1h | Connect GitHub, thiết lập env variables, preview URLs |
| Setup CI/CD GitHub Actions | 2h | Workflow: lint + test + build on PR |
| Thiết lập eslint, prettier | 1h | Coding standards |
| Viết README | 1h | Setup guide, env vars, architecture overview |

#### BE Developer Tasks
| Task | Thời gian | Mô tả |
|---|---|---|
| Supabase schema migration | 2h | Tạo bảng `profiles`, trigger, RLS policies |
| Thiết kế API Routes structure | 1h | Định nghĩa endpoints, response format |
| **Verify API response structure** | **1h** | **Gọi thử từng endpoint phimapi.com, log JSON ra console, xác nhận đúng `items` ở root hay `data.items`** |
| Test Supabase connection | 1h | Verify kết nối server-side |
| Tạo TypeScript types cho API | 2h | `types/kkphim.ts`, `types/supabase.ts` |

#### FE Developer Tasks
| Task | Thời gian | Mô tả |
|---|---|---|
| Setup shadcn/ui | 2h | Install components cần dùng |
| Thiết kế design system | 2h | Color palette, typography, spacing (dark mode) |
| Layout components skeleton | 2h | Header, Footer, Navigation layout |
| Setup Supabase client-side | 1h | `lib/supabase/client.ts` |

#### QA Tasks
| Task | Thời gian | Mô tả |
|---|---|---|
| Setup Vitest | 1h | Configure test environment |
| Setup Playwright | 2h | Configure E2E, base URL, browser config |
| Viết test plan document | 2h | Danh sách test cases theo feature |
| Setup Lighthouse CI | 1h | Performance benchmarks |

---

### 🔐 SPRINT 1: AUTHENTICATION (7 ngày)

**Mục tiêu:** Luồng đăng ký, đăng nhập, đăng xuất hoạt động hoàn chỉnh.

#### BE Developer Tasks (Song song FE)
| Task | Ngày | Mô tả |
|---|---|---|
| Implement Supabase Auth helper | 1 | `createServerSupabaseClient()` cho API routes |
| API middleware auth check | 1 | Server-side session validation |
| Next.js middleware route protection | 1 | `/middleware.ts` — redirect nếu chưa auth |
| Trigger tự động tạo profile | 1 | SQL function + trigger trong Supabase |
| API: GET /api/auth/user | 1 | Trả về thông tin user hiện tại |
| Error handling auth errors | 1 | Map Supabase error codes → thông báo tiếng Việt |

#### FE Developer Tasks (Song song BE)
| Task | Ngày | Mô tả |
|---|---|---|
| Trang `/register` | 1-2 | Form đăng ký (Tên, Email, MK, Xác nhận MK) |
| Trang `/login` | 1-2 | Form đăng nhập (Email, MK) |
| Client-side Supabase Auth | 2 | `signUp()`, `signInWithPassword()`, `signOut()` |
| Form validation | 2 | Zod schema, react-hook-form |
| Auth context / hook | 3 | `useAuth()` hook, `AuthProvider` |
| Protected route wrapper | 3 | Client-side redirect nếu chưa đăng nhập |
| Loading & error states | 4 | Spinner, toast notifications |
| Responsive auth pages | 4 | Mobile-first, đẹp trên điện thoại |

#### QA Tasks (Chạy liên tục)
| Task | Mô tả |
|---|---|
| Unit test: Form validation | Test Zod schema, các trường hợp edge case |
| Unit test: useAuth hook | Mock Supabase, test state transitions |
| E2E: Register flow | Điền form → submit → redirect đến login |
| E2E: Login flow | Đăng nhập → redirect trang chủ |
| E2E: Logout flow | Click logout → redirect login |
| E2E: Protected route | Truy cập route cần auth khi chưa login → redirect |
| E2E: Invalid credentials | Sai mật khẩu → hiển thị lỗi |
| E2E: Duplicate email | Đăng ký email đã tồn tại → thông báo lỗi |

**Deliverable Sprint 1:** Người dùng có thể đăng ký, đăng nhập, đăng xuất. Route được bảo vệ.

**Acceptance Criteria Sprint 1:**
- ✅ Đăng ký với email mới → chuyển đến login thành công
- ✅ Đăng nhập đúng thông tin → vào trang chủ
- ✅ Đăng nhập sai mật khẩu → hiển thị lỗi tiếng Việt
- ✅ Truy cập `/` khi chưa login → redirect về `/login`
- ✅ Đăng xuất → redirect về `/login`, không vào lại được

---

### 🎬 SPRINT 2: CORE MOVIE FEATURES (7 ngày)

**Mục tiêu:** Trang chủ, danh sách phim, chi tiết phim, tìm kiếm hoạt động.

#### BE Developer Tasks
| Task | Ngày | Mô tả |
|---|---|---|
| API proxy: phim mới cập nhật | 1 | `GET /api/movies` → phimapi.com/danh-sach/phim-moi-cap-nhat-v2 |
| API proxy: chi tiết phim | 1 | `GET /api/movies/[slug]` → phimapi.com/phim/{slug} |
| API proxy: tìm kiếm | 2 | `GET /api/search` → phimapi.com/v1/api/tim-kiem |
| API proxy: danh sách theo filter | 2 | `GET /api/danh-sach/[type]` với query params |
| API proxy: thể loại | 3 | `GET /api/the-loai` và `GET /api/the-loai/[slug]` |
| API proxy: quốc gia | 3 | `GET /api/quoc-gia` và `GET /api/quoc-gia/[slug]` |
| Caching strategy | 4 | ISR revalidate 3600s cho danh sách, 1800s cho chi tiết |
| Error handling | 4 | Fallback khi phimapi.com lỗi |

#### FE Developer Tasks
| Task | Ngày | Mô tả |
|---|---|---|
| MovieCard component | 1 | Thumbnail, tên phim, năm, badge (HD/Tập X) |
| MovieGrid component | 1 | Responsive grid, skeleton loading |
| Trang chủ — Hero banner | 2 | Slider phim nổi bật |
| Trang chủ — Danh sách sections | 2 | Phim mới, Phim bộ, Phim lẻ, Hoạt hình |
| Trang `/danh-sach/[type]` | 3 | Grid + phân trang, filter sidebar |
| Trang `/phim/[slug]` — Chi tiết | 4 | Poster, thông tin, mô tả, danh sách tập |
| Trang `/tim-kiem` | 5 | Search bar, advanced filters, kết quả grid |
| Trang `/the-loai/[slug]` | 6 | Danh sách phim theo thể loại |
| Trang `/quoc-gia/[slug]` | 6 | Danh sách phim theo quốc gia |
| Responsive + dark mode | 7 | Polish tất cả pages |

#### QA Tasks
| Task | Mô tả |
|---|---|
| Unit test: MovieCard | Render đúng dữ liệu, badge logic |
| Unit test: API proxy functions | Mock fetch, test error cases |
| E2E: Trang chủ load | Trang chủ hiển thị danh sách phim |
| E2E: Xem chi tiết phim | Click card → chi tiết phim hiển thị đúng |
| E2E: Tìm kiếm cơ bản | Search "Avengers" → hiển thị kết quả |
| E2E: Filter phim bộ | Chọn "Phim Bộ" → chỉ hiển thị phim bộ |
| E2E: Lọc theo quốc gia | Chọn "Hàn Quốc" → phim Hàn |
| E2E: Phân trang | Chuyển trang 2 → load trang tiếp theo |
| Performance: Lighthouse | LCP < 2.5s, trang chủ |

**Deliverable Sprint 2:** Xem danh sách phim, chi tiết, tìm kiếm, lọc hoạt động.

**Acceptance Criteria Sprint 2:**
- ✅ Trang chủ hiển thị ít nhất 12 phim mới, có ảnh thumbnail
- ✅ Click vào phim → trang chi tiết hiển thị đầy đủ thông tin
- ✅ Tìm kiếm "Avengers" → hiển thị kết quả liên quan
- ✅ Lọc "Phim Bộ" → chỉ hiển thị phim bộ
- ✅ LCP trang chủ < 3 giây

---

### 🎥 SPRINT 3: VIDEO PLAYER (7 ngày)

**Mục tiêu:** Xem phim mượt mà, chọn tập, chọn server.

#### BE Developer Tasks
| Task | Ngày | Mô tả |
|---|---|---|
| API: lấy episodes theo phim | 1 | Parse episodes từ movie detail response |
| API: validate link m3u8 | 2 | Kiểm tra link còn hoạt động không |
| Cache episodes | 2 | ISR cho tập phim |

#### FE Developer Tasks
| Task | Ngày | Mô tả |
|---|---|---|
| VideoPlayer component (iframe) | 1-2 | Nhúng link_embed, fullscreen, responsive |
| VideoPlayer component (m3u8) | 2-3 | hls.js integration cho link_m3u8 |
| Server selector | 3 | Tabs chọn server khi có nhiều server |
| EpisodeList component | 4 | Grid tập phim, highlight tập đang xem |
| Trang `/phim/[slug]/xem` | 4-5 | Layout player + episode list |
| Navigation tập tiếp theo/trước | 5 | Nút next/prev episode |
| Auto fallback m3u8 → embed | 6 | Nếu m3u8 lỗi thì dùng embed |
| Breadcrumb navigation | 7 | Tên phim → Tập X |

#### QA Tasks
| Task | Mô tả |
|---|---|
| Unit test: EpisodeList | Render danh sách tập, highlight active |
| Unit test: Server selector | Chuyển server cập nhật player src |
| E2E: Xem phim lẻ | Vào chi tiết → click xem → player load |
| E2E: Xem phim bộ | Vào chi tiết → chọn tập 2 → player load |
| E2E: Chọn server | Click server 2 → player reload đúng link |
| E2E: Next episode | Click "Tập tiếp theo" → tập 2 load |
| E2E: Fullscreen | Click fullscreen button → player full màn hình |
| E2E: Mobile player | Kiểm tra player hoạt động trên 375px |

**Deliverable Sprint 3:** Người dùng xem phim được, chọn tập, chuyển tập, chọn server.

**Acceptance Criteria Sprint 3:**
- ✅ Xem phim lẻ → player load trong vòng 5 giây
- ✅ Xem phim bộ → chọn tập 2 → player chuyển đúng nội dung
- ✅ Click "Player thay thế" → HLS player hoạt động
- ✅ Player responsive trên màn hình 375px

---

### ✨ SPRINT 4: POLISH & PRODUCTION READY (7 ngày)

> ⚠️ Sprint này được mở rộng từ 5 → 7 ngày. "Production ready" cần thời gian đủ để test kỹ.

**Mục tiêu:** Website hoàn chỉnh, ổn định, sẵn sàng dùng thật.

#### Leader Tasks
| Task | Mô tả |
|---|---|
| Security audit | Review toàn bộ auth flow, RLS policies |
| Performance audit | Lighthouse all pages, fix issues |
| Final code review | Review toàn bộ codebase |
| Setup production Vercel | Domain, env vars production |
| Viết hướng dẫn sử dụng | Cho thành viên gia đình/bạn bè |

#### BE Developer Tasks
| Task | Mô tả |
|---|---|
| Rate limiting | Vercel Edge Middleware rate limit |
| API error monitoring | Console errors, proper status codes |
| Optimize caching | Review và tune ISR revalidation times |
| Security headers | CSP, X-Frame-Options via next.config.js |

#### FE Developer Tasks
| Task | Mô tả |
|---|---|
| 404 Not Found page | Trang lỗi đẹp với nút về trang chủ |
| Error boundary | Global error boundary |
| Empty states | "Không tìm thấy phim" UI |
| Loading skeleton | Polish tất cả skeleton animations |
| SEO meta tags | Title, description cho từng trang |
| Favicon + manifest | App icon |
| Accessibility | ARIA labels, keyboard navigation |

#### QA Tasks
| Task | Mô tả |
|---|---|
| Full regression test | Chạy toàn bộ E2E suite |
| Cross-browser test | Chrome, Firefox, Safari |
| Mobile test | iPhone, Android các kích thước |
| Slow network test | 3G throttle, xem phim có buffer không |
| Stress test | 10 users đồng thời |
| Security test | XSS, unauthorized access |
| Final Lighthouse report | Tất cả pages ≥ 90 score |

---

## 4. TESTING STRATEGY

### 4.1 Tháp Testing

```
        ┌─────────┐
        │   E2E   │  ← Ít nhất, chạy lâu (Playwright)
        │  Tests  │     Bao phủ: user flows quan trọng
        ├─────────┤
        │  Integ  │  ← Trung bình (API Routes test)
        │  Tests  │     Bao phủ: API endpoints, DB queries
        ├─────────┤
        │  Unit   │  ← Nhiều nhất, chạy nhanh (Vitest)
        │  Tests  │     Bao phủ: components, hooks, utils
        └─────────┘
```

### 4.2 Cấu Hình Test

#### Vitest (Unit Test)
```typescript
// vitest.config.ts
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      threshold: { lines: 80, functions: 80 }
    }
  }
}
```

#### Playwright (E2E Test)
```typescript
// playwright.config.ts
export default {
  baseURL: 'http://localhost:3000',
  projects: [
    { name: 'Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile', use: { ...devices['iPhone 13'] } },
  ],
  reporter: 'html',
}
```

### 4.3 Danh Sách E2E Test Cases

| ID | Test Case | Priority |
|---|---|---|
| TC01 | Đăng ký tài khoản thành công | P0 |
| TC02 | Đăng ký email đã tồn tại | P1 |
| TC03 | Đăng ký mật khẩu không khớp | P1 |
| TC04 | Đăng nhập thành công | P0 |
| TC05 | Đăng nhập sai mật khẩu | P1 |
| TC06 | Đăng xuất thành công | P0 |
| TC07 | Truy cập route protected khi chưa login | P0 |
| TC08 | Trang chủ hiển thị danh sách phim | P0 |
| TC09 | Tìm kiếm phim theo tên | P0 |
| TC10 | Lọc phim theo thể loại | P1 |
| TC11 | Lọc phim theo quốc gia | P1 |
| TC12 | Xem chi tiết phim | P0 |
| TC13 | Xem phim lẻ (player load) | P0 |
| TC14 | Xem phim bộ, chọn tập | P0 |
| TC15 | Chuyển tập tiếp theo | P1 |
| TC16 | Chọn server khác | P1 |
| TC17 | Responsive mobile 375px | P0 |
| TC18 | Responsive tablet 768px | P1 |

### 4.4 Quy Trình CI/CD Testing

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type Check
        run: npm run type-check
      - name: Unit Tests
        run: npm run test:unit -- --coverage
      - name: Build
        run: npm run build

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: E2E Tests
        run: npm run test:e2e
      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 5. DEPLOYMENT STRATEGY

### 5.1 Environments

| Environment | URL | Trigger | Mục Đích |
|---|---|---|---|
| Development | localhost:3000 | Manual | Local dev |
| Preview | `feature-xxx.vercel.app` | PR tạo | Review trước merge |
| Production | `family-movies.vercel.app` | Merge vào main | Người dùng thật |

### 5.2 Environment Variables

```env
# .env.local (không commit)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...   # Server-only
KKPHIM_API_BASE=https://phimapi.com
NEXT_PUBLIC_APP_URL=https://family-movies.vercel.app
```

### 5.3 Cấu Hình Vercel (vercel.json)

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### 5.4 Supabase Setup Checklist

```
□ Tạo project mới tại supabase.com
□ Lưu SUPABASE_URL và ANON_KEY
□ Chạy SQL migration tạo bảng profiles
□ Tạo trigger handle_new_user
□ Bật Row Level Security
□ Thêm RLS policies cho bảng profiles
□ Cấu hình Redirect URLs trong Auth settings:
    - http://localhost:3000/**
    - https://family-movies.vercel.app/**
□ Disable "Email Confirm" (đơn giản hóa)
```

---

## 6. TIMELINE TỔNG QUAN

```
Tuần 1
├─ Ngày 1-3:   Sprint 0 — Project Setup
└─ Ngày 4-7:   Sprint 1 — Authentication (begin)

Tuần 2
├─ Ngày 8-10:  Sprint 1 — Authentication (finish + QA)
└─ Ngày 11-14: Sprint 2 — Core Features (begin)

Tuần 3
├─ Ngày 15-17: Sprint 2 — Core Features (finish + QA)
└─ Ngày 18-21: Sprint 3 — Video Player (begin)

Tuần 4
├─ Ngày 22-24: Sprint 3 — Video Player (finish + QA)
└─ Ngày 25-29: Sprint 4 — Polish & Production

Tuần 5
└─ Ngày 30:    🚀 PRODUCTION LAUNCH
```

### Gantt Chart (Tóm Tắt)

```
            W1          W2          W3          W4          W5
Role    1234567   8901234   5678901   2345678   9012345
Leader  SSSXXXX   RRRRXXX   RRRRXXX   RRRRXXX   AAAAALL
BE      SSSBBBB   BBBQQBB   CCCQQCC   DDDQQDD   EEEQQLL
FE      SSSFFFF   FFFQQFF   GGGQQGG   HHHQQHH   IIIQQL_
QA      SSSTTTT   TTTQQTT   TTTQQTT   TTTQQTT   RRRRLLLL

S=Setup, B=Auth BE, F=Auth FE, C=Core BE, G=Core FE
D=Player BE, H=Player FE, E=Polish BE, I=Polish FE
T=Testing, R=Review/Regression, Q=QA daily, A=Audit, L=Launch
```

---

## 7. HƯỚNG DẪN SỬ DỤNG CHO THÀNH VIÊN

### Bước 1: Truy Cập Website
Mở trình duyệt, vào địa chỉ: `https://family-movies.vercel.app`

### Bước 2: Đăng Ký Tài Khoản (lần đầu)
1. Click **"Đăng ký tài khoản"**
2. Nhập **Họ và tên**, **Email**, **Mật khẩu** (tối thiểu 8 ký tự), **Xác nhận mật khẩu**
3. Click **"Đăng ký"**
4. Đăng nhập ngay bằng email và mật khẩu vừa tạo

### Bước 3: Xem Phim
1. Từ trang chủ, click vào phim muốn xem
2. Xem thông tin phim, click **"Xem Phim"** hoặc chọn tập
3. Nếu video không load, thử chọn server khác

### Bước 4: Tìm Kiếm Phim
1. Click vào ô tìm kiếm trên header
2. Gõ tên phim (tiếng Việt hoặc tiếng Anh)
3. Dùng bộ lọc để thu hẹp theo thể loại, quốc gia, năm

---

## 8. CHECKLIST TRƯỚC KHI LAUNCH

### Technical
- [ ] Tất cả E2E tests pass (18/18 TC)
- [ ] Lighthouse score ≥ 90 tất cả pages
- [ ] Không có TypeScript errors
- [ ] Không có console errors trong production
- [ ] Env variables được thiết lập đúng trên Vercel
- [ ] Supabase RLS policies hoạt động đúng
- [ ] API proxy không leak keys
- [ ] Mobile responsive OK trên iPhone và Android
- [ ] Dark mode hoạt động đúng

### User Experience
- [ ] Đăng ký → đăng nhập → xem phim flow mượt mà
- [ ] Tìm kiếm nhanh, kết quả đúng
- [ ] Player load được ít nhất 1 server
- [ ] Loading states đẹp, không flicker
- [ ] 404 page có nút về trang chủ
- [ ] Thông báo lỗi tiếng Việt, thân thiện

### Security
- [ ] Route protection hoạt động
- [ ] Không thể access route protected khi logout
- [ ] Service role key không xuất hiện phía client
- [ ] Rate limiting hoạt động

---

*Tài liệu này được xây dựng bởi AI Agent Team*
*Leader | Back-end Developer | Front-end Developer | QA Automation*
*Phiên bản 1.1 | 24/06/2026*
*Cập nhật: Thêm Solo Developer Path, Verify API task, Acceptance Criteria, mở rộng Sprint 4.*
