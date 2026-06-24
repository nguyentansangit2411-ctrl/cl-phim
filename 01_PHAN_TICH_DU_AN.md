# 📋 PHÂN TÍCH DỰ ÁN: WEBSITE XEM PHIM GIA ĐÌNH

> **Phiên bản:** 1.1 | **Ngày:** 24/06/2026 | **Trạng thái:** Reviewed

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mô Tả

Website xem phim trực tuyến dành cho gia đình và nhóm bạn bè, sử dụng hoàn toàn miễn phí với chi phí triển khai **0đ**. Hệ thống tích hợp API từ **KKPhim (phimapi.com)** — nguồn dữ liệu phim lớn nhất Việt Nam với hơn **29,027 bộ phim** được cập nhật liên tục.

### 1.2 Mục Tiêu

- Tạo không gian xem phim riêng tư cho gia đình và bạn bè.
- Yêu cầu đăng nhập để kiểm soát truy cập (không phải cổng công khai).
- Trải nghiệm xem phim mượt mà, tìm kiếm linh hoạt.
- Chi phí vận hành hàng tháng: **0đ**.

### 1.3 Người Dùng Mục Tiêu

| Đối tượng | Đặc điểm | Nhu cầu |
|---|---|---|
| Thành viên gia đình | Mọi lứa tuổi, ít kinh nghiệm kỹ thuật | Giao diện đơn giản, dễ dùng |
| Bạn bè | Đa dạng | Tìm kiếm nhanh, xem nhiều thể loại |
| Quản trị viên (chủ dự án) | Có kiến thức kỹ thuật | Quản lý tài khoản thành viên |

---

## 2. PHÂN TÍCH NGUỒN DỮ LIỆU — KKPhim API

### 2.1 Tổng Quan API

**Base URL:** `https://phimapi.com`
**Loại:** REST API, miễn phí, không cần API key.
**Tổng phim:** 29,027+ bộ, cập nhật hàng ngày (~15 phim/ngày).

### 2.2 Các Endpoint Chính

#### 🎬 Danh Sách Phim Mới Cập Nhật
```
GET https://phimapi.com/danh-sach/phim-moi-cap-nhat?page={page}
GET https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page={page}   ← Nên dùng
GET https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page={page}
```

#### 🔍 Chi Tiết Phim & Danh Sách Tập
```
GET https://phimapi.com/phim/{slug}
```
Ví dụ: `https://phimapi.com/phim/ngoi-truong-xac-song`

#### 📂 Tổng Hợp Danh Sách Phim (Có Filter)
```
GET https://phimapi.com/v1/api/danh-sach/{type_list}
    ?page={page}
    &sort_field={_id|modified.time|year}
    &sort_type={asc|desc}
    &sort_lang={vietsub|thuyet-minh|long-tieng}
    &category={hanh-dong|tinh-cam|...}
    &country={trung-quoc|han-quoc|...}
    &year={2024}
    &limit={1-64}
```

**type_list hỗ trợ:**
- `phim-bo` — Phim bộ (series)
- `phim-le` — Phim lẻ (movie)
- `tv-shows` — TV Shows
- `hoat-hinh` — Hoạt hình
- `phim-vietsub` — Phim có Vietsub
- `phim-thuyet-minh` — Phim có Thuyết Minh
- `phim-long-tieng` — Phim có Lồng Tiếng

#### 🔎 Tìm Kiếm
```
GET https://phimapi.com/v1/api/tim-kiem
    ?keyword={keyword}
    &page={page}
    &category={slug}
    &country={slug}
    &year={year}
    &limit={limit}
```

#### 🏷️ Thể Loại & Quốc Gia
```
GET https://phimapi.com/the-loai           ← Lấy tất cả thể loại
GET https://phimapi.com/quoc-gia           ← Lấy tất cả quốc gia
GET https://phimapi.com/v1/api/the-loai/{slug}?...
GET https://phimapi.com/v1/api/quoc-gia/{slug}?...
GET https://phimapi.com/v1/api/nam/{year}?...
```

#### 🖼️ Tối Ưu Ảnh
```
GET https://phimapi.com/image.php?url={url_anh_kkphim}
```
Tự động chuyển đổi sang `.webp` — tăng tốc tải ảnh đáng kể.

### 2.3 Cấu Trúc Dữ Liệu Phim (Response Mẫu)

```json
{
  "movie": {
    "_id": "...",
    "name": "Tên phim tiếng Việt",
    "origin_name": "Original Title",
    "slug": "ten-phim",
    "type": "series|single",
    "thumb_url": "https://...",
    "poster_url": "https://...",
    "year": 2024,
    "quality": "HD|FHD|4K",
    "lang": "Vietsub|Lồng Tiếng|Thuyết Minh",
    "episode_current": "Tập 12",
    "episode_total": "24 tập",
    "category": [{ "id": "...", "name": "Hành Động", "slug": "hanh-dong" }],
    "country": [{ "id": "...", "name": "Hàn Quốc", "slug": "han-quoc" }],
    "actor": ["Tên diễn viên"],
    "director": ["Tên đạo diễn"],
    "description": "Nội dung phim...",
    "tmdb": { "id": "...", "type": "tv|movie", "vote_average": 8.5 }
  },
  "episodes": [
    {
      "server_name": "Server #1",
      "server_data": [
        {
          "name": "Tập 1",
          "slug": "tap-1",
          "filename": "...",
          "link_embed": "https://...",
          "link_m3u8": "https://..."
        }
      ]
    }
  ]
}
```

### 2.4 Thể Loại Có Sẵn (24 thể loại)

Hành Động | Cổ Trang | Chiến Tranh | Viễn Tưởng | Kinh Dị | Tài Liệu | Bí Ẩn | Tình Cảm | Tâm Lý | Thể Thao | Phiêu Lưu | Âm Nhạc | Gia Đình | Học Đường | Hài Hước | Hình Sự | Võ Thuật | Khoa Học | Thần Thoại | Chính Kịch | Kinh Điển | Phim Ngắn | Phim 18+

### 2.5 Đánh Giá API

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Tính ổn định | ⭐⭐⭐⭐ | Hoạt động ổn định, có CDN |
| Tốc độ | ⭐⭐⭐⭐ | Nhanh, hỗ trợ webp |
| Dữ liệu | ⭐⭐⭐⭐⭐ | 29K+ phim, cập nhật ngày |
| Miễn phí | ✅ | Không cần key, không giới hạn |
| Hỗ trợ lọc | ⭐⭐⭐⭐⭐ | Lọc đa chiều: thể loại, quốc gia, năm, ngôn ngữ |

---

## 3. YÊU CẦU CHỨC NĂNG

### 3.1 Module Xác Thực (Authentication)

#### Đăng Ký Tài Khoản
- Nhập: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu.
- Validation: Email hợp lệ, mật khẩu tối thiểu 8 ký tự, 2 mật khẩu phải khớp.
- Role mặc định: `user`.
- Sau đăng ký: Chuyển thẳng đến trang đăng nhập (không cần xác thực email — để đơn giản).

#### Đăng Nhập
- Đăng nhập bằng Email + Mật khẩu.
- Lưu session qua Supabase Auth.
- Redirect sau đăng nhập: Trang chủ.

> **Chính sách đăng ký:** Mở (open registration) — bất kỳ ai có link đều có thể tạo tài khoản.
> Website có tính chất nội bộ nên không cần kiểm duyệt email.
> Nếu muốn giới hạn: Tắt đăng ký, Admin thêm user thủ công qua Supabase Dashboard.

#### Đăng Xuất
- Xóa session, redirect về trang đăng nhập.

#### Bảo Vệ Route
- Toàn bộ nội dung website chỉ xem được khi đăng nhập.
- Route `/login`, `/register` là public.

### 3.2 Module Trang Chủ

- Banner phim nổi bật (lấy từ phim mới nhất).
- Danh sách "Phim Mới Cập Nhật" (phân trang).
- Danh mục nhanh: Phim Bộ, Phim Lẻ, Hoạt Hình, TV Shows.
- Grid/Slider phim theo thể loại phổ biến.

### 3.3 Module Tìm Kiếm

- Thanh tìm kiếm nổi bật (header).
- Tìm kiếm theo từ khóa real-time (debounce 500ms).
- Bộ lọc nâng cao: Thể loại, Quốc gia, Năm, Ngôn ngữ, Sắp xếp.
- Hiển thị kết quả dạng grid card với phân trang.

### 3.4 Module Danh Sách Phim

- Trang danh sách theo: Loại phim, Thể loại, Quốc gia, Năm.
- Filter và sort trực quan.
- Infinite scroll hoặc phân trang số.

### 3.5 Module Chi Tiết Phim

- Poster, tên phim, rating TMDB.
- Thông tin: Năm, thể loại, quốc gia, ngôn ngữ, đạo diễn, diễn viên.
- Nội dung tóm tắt phim.
- Trạng thái: Hoàn tất / Đang chiếu (số tập hiện tại / tổng tập).
- Danh sách tập phim (nếu là phim bộ).
- Nút "Xem Phim" / "Xem Tập X".

### 3.6 Module Xem Phim (Player)

- Nhúng video player từ `link_embed` của KKPhim.
- Chọn server (nếu có nhiều server).
- Chọn tập phim (đối với phim bộ).
- Điều hướng tập tiếp theo / trước.
- Fullscreen.

---

## 3.7 User Stories (Các Kịch Bản Quan Trọng)

> Format: *"Đưa ra là [vai trò], tôi muốn [hành động], để [mục đích]"*

| ID | User Story | Acceptance Criteria | ᫰u tiên |
|---|---|---|---|
| US01 | Là thành viên mới, tôi muốn đăng ký tài khoản, để truy cập website | Form đăng ký hoạt động, đăng nhập được ngay sau đăng ký | P0 |
| US02 | Là thành viên, tôi muốn xem danh sách phim mới nhất, để biết có phim gì hay | Trang chủ hiển thị ít nhất 12 phim mới, có ảnh thumbnail rõ nét | P0 |
| US03 | Là thành viên, tôi muốn tìm kiếm phim theo tên, để xem phim mình muốn | Gõ từ khóa → hiển thị kết quả chính xác | P0 |
| US04 | Là thành viên, tôi muốn xem chi tiết phim (nội dung, diễn viên, đánh giá), để quyết định có xem không | Trang chi tiết hiển thị đầy đủ thông tin và nút Xem Phim | P0 |
| US05 | Là thành viên, tôi muốn xem phim trực tuyến, để giải trí cùng gia đình | Player load trong vòng 5 giây, có fullscreen, hoạt động trên điện thoại | P0 |
| US06 | Là thành viên xem phim bộ, tôi muốn chọn tập phim, để theo dõi tiếp | Danh sách tập hiển thị, click tập → player chuyển đúng nội dung | P0 |
| US07 | Là thành viên, tôi muốn lọc phim theo thể loại/quốc gia, để xem phim ưa thích | Filter hoạt động, kết quả chỉ hiển thị phim đúng thể loại | P1 |
| US08 | Là admin, tôi muốn xem danh sách thành viên, để kiểm soát truy cập | Trang `/admin/users` liệt kê tài khoản (roadmap v1.1) | P2 |

---

 YÊU CẦU PHI CHỨC NĂNG

### 4.1 Hiệu Năng
- Trang chủ tải dưới 3 giây (LCP < 2.5s).
- Tìm kiếm phản hồi dưới 500ms.
- Hình ảnh dùng định dạng WebP qua API KKPhim.
- Next.js SSR/ISR để cache dữ liệu tĩnh.

### 4.2 Bảo Mật
- Không lưu mật khẩu thô — Supabase Auth dùng bcrypt.
- JWT token hết hạn sau 7 ngày.
- Middleware bảo vệ tất cả route cần auth.
- Input sanitization chống XSS: dùng `isomorphic-dompurify` khi render nội dung HTML từ API bên ngoài.
- Rate limiting trên Vercel Edge.
- `SUPABASE_SERVICE_ROLE_KEY` chỉ sử dụng phía server, không bao giờ expose ra client.

### 4.3 Khả Năng Sử Dụng
- Responsive: Mobile (320px+), Tablet, Desktop.
- Hỗ trợ dark mode.
- Loading skeleton thay vì spinner đơn giản.

### 4.4 Chi Phí
- Hoàn toàn **0đ/tháng** trên free tier.

---

## 5. KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│              Next.js 14 App Router (React)               │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────────┐
│                  VERCEL (Free Tier)                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │           Next.js Server (Edge/Node)             │    │
│  │  ┌──────────────┐  ┌───────────────────────┐   │    │
│  │  │  App Router  │  │   API Routes          │   │    │
│  │  │  (Pages/UI)  │  │  /api/auth            │   │    │
│  │  └──────────────┘  │  /api/movies (proxy)  │   │    │
│  │                    └───────────────────────┘   │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────┬──────────────────┬──────────────────┘
                    │                  │
      ┌─────────────▼──────┐  ┌───────▼──────────────────┐
      │  SUPABASE (Free)   │  │  PHIMAPI.COM (KKPhim)    │
      │  ┌───────────────┐ │  │  - Danh sách phim        │
      │  │  Auth         │ │  │  - Chi tiết phim         │
      │  │  (users,      │ │  │  - Tìm kiếm              │
      │  │   sessions)   │ │  │  - Tập phim              │
      │  ├───────────────┤ │  │  - Thể loại/Quốc gia     │
      │  │  PostgreSQL   │ │  │  - CDN ảnh webp           │
      │  │  (profiles)   │ │  └──────────────────────────┘
      │  └───────────────┘ │
      └────────────────────┘
```

### 5.1 Luồng Xác Thực

```
User → /register → Supabase Auth (signUp) → Session JWT
User → /login    → Supabase Auth (signIn) → Session JWT → Cookie
User → /[page]   → Middleware kiểm tra JWT → Allow/Redirect
```

### 5.2 Luồng Lấy Dữ Liệu Phim

```
Client → Next.js API Route (/api/movies) → phimapi.com → Cache (ISR)
```

> **Tại sao proxy qua Next.js API Route?**
> Tránh CORS, có thể cache ở edge, ẩn nguồn dữ liệu, dễ xử lý lỗi tập trung.

---

## 6. STACK CÔNG NGHỆ & LÝ DO CHỌN

### 6.1 Frontend + Backend: Next.js 14 (App Router)

| Ưu điểm | Chi tiết |
|---|---|
| Full-stack | 1 repo = FE + BE (API Routes), không cần server riêng |
| SSR/ISR | Cache API KKPhim, tránh gọi API mỗi request |
| SEO | Server-side rendering tốt cho trang phim |
| Performance | Image optimization tích hợp, Code splitting tự động |
| Free deploy | Vercel hỗ trợ Next.js native, free tier rộng rãi |
| Ecosystem | React ecosystem lớn, Tailwind CSS, shadcn/ui |

### 6.2 Auth + Database: Supabase

| Ưu điểm | Chi tiết |
|---|---|
| Free tier | 500MB database, 50,000 MAU, không hết hạn |
| Auth tích hợp | Email/password, JWT, session management sẵn |
| PostgreSQL | Database mạnh, có Row Level Security (RLS) |
| SDK đơn giản | `@supabase/ssr` tích hợp Next.js 14 trực tiếp |
| Realtime | Có thể mở rộng sau (watch together feature) |

### 6.3 Deploy: Vercel

| Ưu điểm | Chi tiết |
|---|---|
| Free tier | 100GB bandwidth/tháng, unlimited projects |
| Native Next.js | Được tạo bởi team Next.js, zero-config deploy |
| Edge Network | CDN toàn cầu, latency thấp |
| CI/CD | Auto deploy từ GitHub push |
| Domain | Miễn phí subdomain `*.vercel.app` |

### 6.4 Bảng Chi Phí Hàng Tháng

| Service | Free Tier | Giới Hạn | Dự Kiến Dùng |
|---|---|---|---|
| Vercel | $0 | 100GB bandwidth, 100h build | < 10GB |
| Supabase | $0 | 500MB DB, 50K MAU | < 50MB |
| phimapi.com | $0 | Không giới hạn | N/A |
| **Tổng** | **$0** | | |

### 6.5 Các Thư Viện Chính

```
Next.js 14            → Framework chính
Tailwind CSS          → Styling
shadcn/ui             → Component library
@supabase/ssr         → Supabase client cho Next.js
video.js / hls.js     → Video player (m3u8 support)
react-query (TanStack)→ Data fetching, caching
lucide-react          → Icons
```

---

## 7. THIẾT KẾ CƠ SỞ DỮ LIỆU (Supabase)

### 7.1 Bảng `profiles` (Mở rộng từ Supabase Auth)

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User chỉ xem được profile của mình
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- User chỉ cập nhật profile của mình
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 7.2 Trigger Tự Động Tạo Profile

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 8. CẤU TRÚC THƯ MỤC DỰ ÁN

```
family-movies/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          ← Trang đăng nhập
│   │   └── register/
│   │       └── page.tsx          ← Trang đăng ký
│   ├── (main)/                   ← Route group (protected)
│   │   ├── layout.tsx            ← Layout có header/nav
│   │   ├── page.tsx              ← Trang chủ
│   │   ├── phim/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      ← Chi tiết phim
│   │   │       └── xem/
│   │   │           └── page.tsx  ← Trang xem phim
│   │   ├── tim-kiem/
│   │   │   └── page.tsx          ← Trang tìm kiếm
│   │   ├── danh-sach/
│   │   │   └── [type]/
│   │   │       └── page.tsx      ← Danh sách theo loại
│   │   ├── the-loai/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── quoc-gia/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── api/
│   │   ├── movies/
│   │   │   ├── route.ts          ← GET danh sách phim
│   │   │   └── [slug]/
│   │   │       └── route.ts      ← GET chi tiết phim
│   │   └── search/
│   │       └── route.ts          ← GET tìm kiếm
│   ├── layout.tsx                ← Root layout
│   └── middleware.ts             ← Auth middleware
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── movies/
│   │   ├── MovieCard.tsx         ← Card phim
│   │   ├── MovieGrid.tsx         ← Grid danh sách phim
│   │   ├── MovieSlider.tsx       ← Slider banner
│   │   └── EpisodeList.tsx       ← Danh sách tập
│   ├── player/
│   │   └── VideoPlayer.tsx       ← Video player component
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   └── SearchFilters.tsx
│   └── ui/                       ← shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← Client-side supabase
│   │   └── server.ts             ← Server-side supabase
│   ├── kkphim/
│   │   ├── api.ts                ← KKPhim API calls
│   │   └── types.ts              ← TypeScript types
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useMovies.ts
├── types/
│   └── index.ts
├── middleware.ts                  ← Next.js middleware
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 9. LUỒNG NGƯỜI DÙNG (User Flow)

### 9.1 Đăng Ký

```
Truy cập website
    ↓
Redirect → /login (chưa đăng nhập)
    ↓
Click "Đăng ký tài khoản"
    ↓
/register: Nhập Tên, Email, Mật khẩu, Xác nhận MK
    ↓
Validation client-side → Gửi form
    ↓
Supabase Auth: signUp(email, password, {full_name})
    ↓
Trigger tạo profile trong bảng profiles
    ↓
Redirect → /login với thông báo "Đăng ký thành công"
```

### 9.2 Đăng Nhập & Xem Phim

```
/login: Nhập Email + Mật khẩu
    ↓
Supabase Auth: signInWithPassword()
    ↓
Lưu session cookie (HTTP-only)
    ↓
Redirect → / (Trang chủ)
    ↓
Xem danh sách phim mới
    ↓
Click phim → /phim/[slug] (Chi tiết)
    ↓
Click "Xem Phim" → /phim/[slug]/xem
    ↓
Load video player với link_embed
    ↓
Xem phim 🎬
```

---

## 10. RỦI RO & GIẢI PHÁP

| Rủi Ro | Mức Độ | Giải Pháp |
|---|---|---|
| phimapi.com ngừng hoạt động | Cao | Cache ISR 1h, fallback UI. Dự phòng: ophim1.com (format tương đồng) |
| Vercel free tier hết quota | Thấp | Bandwidth 100GB/tháng đủ dùng |
| Supabase free tier quá hạn | Thấp | 500MB database, chỉ lưu user data |
| Link video bị chặn | Trung bình | Hiển thị thông báo chọn server khác, fallback HLS → embed |
| CORS từ phimapi.com | Thấp | Proxy qua Next.js API Routes |
| Quá nhiều người đăng ký | Thấp | Supabase 50K MAU free. Tắt đăng ký từ Dashboard nếu cần |
| XSS từ nội dung API | Thấp | Dùng `isomorphic-dompurify` sanitize HTML trước khi render |

---

## 11. PHẠM VI NGOÀI DỰ ÁN (Out of Scope)

Các tính năng KHÔNG triển khai trong phiên bản đầu để giữ đơn giản:
- Quản lý admin (CRUD user).
- Lịch sử xem phim.
- Danh sách yêu thích.
- Bình luận / Rating.
- Thông báo phim mới.
- Xem cùng nhau (Watch Together).
- Thanh toán / Premium plan.

> Những tính năng này có thể bổ sung ở phiên bản sau mà không thay đổi kiến trúc cốt lõi.

---

*Tài liệu này được xây dựng bởi AI Agent Team | Phiên bản 1.1 | 24/06/2026*
*Cập nhật: Thêm User Stories, làm rõ chính sách đăng ký, cập nhật riủi ro và bảo mật.*
