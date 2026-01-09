# URL Shortener

Aplikasi URL Shortener modern yang dibangun dengan Next.js 15, TypeScript, Prisma, dan PostgreSQL. Aplikasi ini memungkinkan pengguna untuk memendekkan URL panjang menjadi link pendek yang mudah dibagikan, dilengkapi dengan fitur pelacakan klik yang detail.

## Fitur Utama

- **URL Shortening**: Buat link pendek dari URL panjang dengan custom key atau auto-generated
- **Authentication**: Login dengan Google OAuth dan email/password
- **Dashboard**: Kelola semua link yang telah dibuat
- **Link Analytics**: Pantau performa link dengan data klik yang detail
- **Custom Redirect Page**: Halaman redirect kustom yang user-friendly
- **Click Tracking**: Lacak berbagai informasi tentang pengunjung:
  - IP Address
  - Negara & Kota (via Vercel headers)
  - Device type (desktop/mobile/tablet)
  - Browser & OS
- **Dark Mode**: Support tema gelap dan terang
- **Responsive Design**: Tampilan optimal di semua device

## Tech Stack

### Frontend
- **Next.js 15** - React framework dengan App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Komponen UI yang accessible
- **Lucide React** - Icon library
- **React Query (TanStack Query)** - Data fetching & caching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Backend serverless
- **Prisma** - ORM untuk database
- **PostgreSQL** - Database
- **NextAuth.js 5** - Authentication
- **bcryptjs** - Password hashing

### Analytics & Utilities
- **nanoid** - Generate unique ID untuk short key
- **UA Parser JS** - Parse user agent untuk device/browser detection
- **Sonner** - Toast notifications

## Struktur Project

```
url-shortener/
├── prisma/
│   └── schema.prisma              # Database schema dan models
│
├── public/                        # Static assets (SVG images)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── actions/                   # Server Actions (CRUD operations)
│   │   ├── links.ts              # Actions untuk link (create, update, delete, get)
│   │   ├── login.ts              # Login action
│   │   └── register.ts           # Register action
│   │
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth layout group
│   │   │   ├── layout.tsx        # Layout untuk halaman auth
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   ├── page.tsx  # Halaman login
│   │   │       │   └── _components/
│   │   │       │       └── login.tsx
│   │   │       └── (register)/
│   │   │           └── page.tsx  # Halaman register
│   │   │
│   │   ├── (protected)/          # Protected layout group (memerlukan auth)
│   │   │   ├── layout.tsx        # Layout untuk halaman yang butuh auth
│   │   │   └── dashboard/
│   │   │       ├── page.tsx      # Halaman dashboard utama
│   │   │       └── _components/
│   │   │           └── dashboard.tsx
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │       │   └── route.ts  # NextAuth.js API handler
│   │   │   ├── links/
│   │   │   │   └── route.ts      # API endpoints untuk links
│   │   │   └── verify-turnstile/
│   │   │       └── route.ts      # Verify Turnstile captcha
│   │   │
│   │   ├── [key]/                # Dynamic route untuk short links
│   │   │   ├── page.tsx          # Halaman redirect
│   │   │   ├── redirect-page.tsx # Komponen redirect
│   │   │   └── detail/
│   │   │       ├── page.tsx      # Halaman detail link
│   │   │       └── client.tsx    # Client component untuk detail
│   │   │
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   └── favicon.ico           # Favicon
│   │
│   ├── components/               # React Components
│   │   ├── auth/                 # Auth-related components
│   │   │   ├── form-create-link.tsx  # Form untuk membuat link baru
│   │   │   ├── form-edit-link.tsx    # Form untuk edit link
│   │   │   ├── form-login.tsx        # Form login
│   │   │   └── form-register.tsx     # Form register
│   │   │
│   │   ├── common/               # Common components
│   │   │   ├── sidebar.tsx       # Sidebar navigation
│   │   │   └── theme-toggle.tsx  # Dark mode toggle
│   │   │
│   │   ├── dashboard/            # Dashboard components
│   │   │   └── columns.tsx       # Kolom untuk data table
│   │   │
│   │   └── ui/                   # UI Components (shadcn/ui style)
│   │       ├── alert-dialog.tsx  # Alert dialog component
│   │       ├── button.tsx        # Button component
│   │       ├── card.tsx          # Card component
│   │       ├── dialog.tsx        # Dialog component
│   │       ├── dropdown-menu.tsx # Dropdown menu
│   │       ├── form.tsx          # Form wrapper
│   │       ├── input.tsx         # Input component
│   │       ├── label.tsx         # Label component
│   │       ├── sheet.tsx         # Sheet/sidebar component
│   │       ├── sonner.tsx        # Toast component
│   │       └── table.tsx         # Table component
│   │
│   ├── constants/                # Constants dan static data
│   │   └── register-constant.tsx
│   │
│   ├── data/                     # Data layer (seeding)
│   │   └── user.ts               # User seed data
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── db.ts                 # Prisma client instance
│   │   ├── getBaseUrl.ts         # Get base URL utility
│   │   └── utils.ts              # General utilities (cn function)
│   │
│   ├── provider/                 # React Context Providers
│   │   ├── react-query-provider.tsx  # TanStack Query provider
│   │   └── theme-provider.tsx        # Theme provider (dark/light mode)
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── auth.d.ts             # Auth-related types
│   │
│   ├── validations/              # Zod validation schemas
│   │   └── auth-validation.ts    # Schemas untuk auth & links
│   │
│   ├── auth.config.ts            # NextAuth configuration
│   ├── auth.ts                   # NextAuth instance
│   ├── middleware.ts             # Next.js middleware (route protection)
│   └── routes.ts                 # Route definitions
│
├── .env.example                  # Example environment variables
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Penjelasan Struktur Folder

### `/prisma`
Berisi schema database menggunakan Prisma ORM. Schema ini mendefinisikan tabel-tabel:
- **User**: Data pengguna (email, password, name)
- **Account**: Akun OAuth (Google, dll)
- **Link**: Data URL yang dipendekkan
- **ClickEvent**: Data analytics klik pada link

### `/src/app`
Menggunakan Next.js App Router dengan struktur:
- **Route Groups**: `(auth)` dan `(protected)` untuk grouping routes tanpa mempengaruhi URL
- **API Routes**: Endpoint backend di `api/`
- **Dynamic Routes**: `[key]` untuk handle short links

### `/src/actions`
Server Actions untuk operasi database:
- **links.ts**: CRUD links dan tracking clicks
- **login.ts & register.ts**: Authentication logic

### `/src/components`
Reusable React components:
- **ui/**: Base UI components (shadcn/ui style)
- **auth/**: Form components untuk authentication
- **dashboard/**: Dashboard-specific components
- **common/**: Shared components (sidebar, theme toggle)

### `/src/lib`
Utility functions dan helper libraries:
- **db.ts**: Prisma client untuk database operations
- **utils.ts**: Class name utilities (cn function untuk Tailwind)

### `/src/provider`
React Context providers untuk global state:
- **theme-provider**: Dark/light mode management
- **react-query-provider**: Server state management

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  links         Link[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Link Model
```prisma
model Link {
  id          String  @id @default(cuid())
  key         String  @unique  // Short code (abc123)
  url         String             // Destination URL
  title       String?
  description String?
  password    String?           // Optional password protection
  expiresAt   DateTime?         // Optional expiration
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  clicks      ClickEvent[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### ClickEvent Model
```prisma
model ClickEvent {
  id       String   @id @default(cuid())
  linkId   String
  link     Link     @relation(fields: [linkId], references: [id])
  ip       String?
  country  String?
  city     String?
  device   String?
  browser  String?
  os       String?
  referer  String?
  createdAt DateTime @default(now())
}
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm, yarn, pnpm, atau bun

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Setup environment variables**

   Copy `.env.example` ke `.env` dan isi dengan nilai Anda:
   ```bash
   cp .env.example .env
   ```

   Environment variables yang dibutuhkan:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/urlshortener"
   AUTH_GOOGLE_MAIL="your-email@gmail.com"
   AUTH_SECRET="your-auth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Opsional) Seed database
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   # atau
   bun dev
   ```

6. **Buka browser**

   Navigate ke [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server dengan Turbopack |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Links
- `GET /api/links` - Get all user links (paginated)
- `POST /api/links` - Create new link
- `PATCH /api/links` - Update link
- `DELETE /api/links` - Delete link

### Short Links
- `GET /[key]` - Redirect short URL ke original URL

## Deployment

### Vercel (Recommended)

Project ini optimized untuk Vercel deployment:

1. Push kode ke GitHub
2. Import project ke [Vercel](https://vercel.com)
3. Setup environment variables di Vercel dashboard
4. Deploy!

### Environment Variables untuk Production

```env
DATABASE_URL="postgresql://..."
AUTH_GOOGLE_MAIL="your-email@gmail.com"
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-domain.com"
```

### Database Setup untuk Production

Gunakan managed PostgreSQL service seperti:
- [Vercel Postgres](https://vercel.com/postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

Setelah setup, run:
```bash
npx prisma migrate deploy
```

## Features Detail

### URL Shortening Flow

1. User submit URL di dashboard
2. System generate unique short key (7 karakter) atau gunakan custom key
3. Link disimpan ke database dengan userId
4. User dapat share short URL: `https://domain.com/abc123`

### Redirect Flow

1. User klik short URL
2. System:
   - Query database untuk cari original URL
   - Log click event (IP, device, location, browser, OS)
   - Redirect ke original URL
3. Semua tracking dilakukan non-blocking agar cepat

### Analytics

Setiap click pada link tercatat dengan data:
- **IP Address**: Dari `x-forwarded-for` atau `x-real-ip` headers
- **Location**: Negara & kota dari Vercel headers (`x-vercel-ip-country`, `x-vercel-ip-city`)
- **Device**: Desktop/mobile/tablet dari UA parsing
- **Browser & OS**: Dari user-agent string

## Roadmap

- [ ] Custom domain support
- [ ] QR Code generation untuk links
- [ ] Link expiration dengan countdown
- [ ] Password protection untuk links
- [ ] Workspace/team support
- [ ] Export analytics to CSV
- [ ] Real-time click analytics
- [ ] API untuk developers

## Contributing

Contributions are welcome! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is open source and available under the MIT License.

## Support

Jika ada pertanyaan atau issues, silakan:
- Open GitHub Issue
- Contact: [your-email@gmail.com]

---

Built with [Next.js](https://nextjs.org) | [Prisma](https://prisma.io) | [Tailwind CSS](https://tailwindcss.com)
