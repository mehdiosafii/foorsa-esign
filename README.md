# Foorsa E-Sign Contract Platform

A modern e-signature contract platform for Foorsa (Opportunity Solutions SARL) with seller tracking, built with React, Vite, TypeScript, Tailwind CSS, and deployed on Vercel with Supabase backend.

## 🚀 Live Deployment

- **Production URL**: https://foorsacontract.vercel.app
- **GitHub Repository**: https://github.com/mehdiosafii/foorsa-esign
- **Vercel Project**: foorsa/foorsacontract

## ✨ Features

### Customer-Facing Features
1. **Multi-step Contract Flow**
   - Student information form with validation
   - Contract review with scrollable Arabic content
   - Digital signature capture
   - PDF generation and download

2. **Seller Tracking**
   - URL parameter `?seller=CODE` associates contracts with sellers
   - Seller name displayed during signup
   - All contracts tagged with seller information

3. **Smart Form Inputs**
   - Country code phone selector
   - Email domain autocomplete
   - Auto-calculation of fees based on program type
   - Date-based dynamic pricing
   - Guardian fields for minors (under 18)

4. **PDF Generation**
   - Client-side PDF generation using html2canvas + jsPDF
   - Two-page A4 landscape contract
   - Branded with logo, stamp, and watermark
   - Digital signature embedded
   - Customer and official (stamped) versions

### Admin Dashboard Features
1. **Contract Management**
   - View all signed contracts
   - Search by name or national ID
   - Filter by seller
   - Filter by status (signed/pending/rejected)
   - Change contract status
   - Download customer or official PDF versions
   - Real-time contract count

2. **Seller Management**
   - Add new sellers with unique codes
   - View seller list with contract counts
   - Generate unique seller links
   - Copy seller-specific URLs
   - Deactivate sellers

3. **Settings Panel**
   - **Branding Tab**: Upload logo, stamp, watermark images
   - **Pricing Tab**: Configure fees for all program types
   - **Sellers Tab**: Manage seller accounts

4. **Statistics**
   - Overall contract counts
   - Per-seller breakdown
   - Status distribution

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 (with @tailwindcss/postcss)
- **UI Components**: Custom components with lucide-react icons
- **PDF Generation**: jsPDF + html2canvas
- **Signature**: react-signature-canvas

### Backend (Vercel Serverless)
- **API Routes** (in `/api` folder):
  - `POST /api/contracts` - Submit new contract (no auth)
  - `GET /api/contracts` - List contracts (admin auth)
  - `PATCH /api/contracts/[id]` - Update contract status (admin auth)
  - `GET /api/sellers` - List sellers (admin auth)
  - `POST /api/sellers` - Create seller (admin auth)
  - `PATCH /api/sellers/[id]` - Update seller (admin auth)
  - `DELETE /api/sellers/[id]` - Deactivate seller (admin auth)
  - `GET /api/stats` - Get statistics (admin auth)
  - `POST /api/auth/admin` - Validate admin password

### Database (Supabase PostgreSQL)
- **Connection**: Pooled PostgreSQL via `pg` library
- **Tables**: Self-healing (CREATE IF NOT EXISTS)
  - `esign_contracts` - Stores all contract data
  - `esign_sellers` - Stores seller information

### Authentication
- **Admin Auth**: Password-based (stored in `ADMIN_PASSWORD` env var)
- **API Auth**: Header-based (`X-Admin-Password`) for admin endpoints
- **Customer Submission**: No authentication required

## 🔧 Local Development

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mehdiosafii/foorsa-esign.git
   cd foorsa-esign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   DATABASE_URL=postgresql://postgres.cetxjzzoswrcykhcxwai:FoorsaReward2026SecureDb@aws-1-eu-west-2.pooler.supabase.com:6543/postgres
   ADMIN_PASSWORD=FoorsaContract2026!
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📋 Database Schema

### `esign_contracts` Table
```sql
CREATE TABLE IF NOT EXISTS esign_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_full_name TEXT NOT NULL,
  student_national_id TEXT NOT NULL,
  student_birth_date TEXT,
  student_phone TEXT,
  student_email TEXT,
  guardian_name TEXT,
  guardian_id TEXT,
  program TEXT NOT NULL,
  fees_dossier NUMERIC,
  fees_service NUMERIC,
  fees_total NUMERIC,
  signature_data TEXT,
  signed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  status TEXT DEFAULT 'signed',
  seller_code TEXT,
  seller_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `esign_sellers` Table
```sql
CREATE TABLE IF NOT EXISTS esign_sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔐 Environment Variables

Set these on Vercel (already configured for production):

- `DATABASE_URL` - Supabase PostgreSQL connection string
- `ADMIN_PASSWORD` - Admin dashboard password (default: `FoorsaContract2026!`)

## 🌐 Usage

### For Customers
1. **Standard link**: https://foorsacontract.vercel.app
2. **Seller-specific link**: https://foorsacontract.vercel.app?seller=houda
3. **Student-only link** (hides admin button): https://foorsacontract.vercel.app?student=1

### For Admins
1. **Access admin**: https://foorsacontract.vercel.app?secret_admin=1
2. **Login**: Enter password `FoorsaContract2026!`
3. **Manage**: View contracts, manage sellers, update settings

### For Sellers
1. Admin creates seller account with unique code (e.g., "houda")
2. Admin copies seller-specific link from Settings → Sellers tab
3. Seller shares their unique link with customers
4. All contracts from that link are tagged with seller info
5. Admin can filter contracts by seller in dashboard

## 📦 Deployment

### Deploy to Vercel
```bash
npx vercel --prod --yes
```

### Set Environment Variables
```bash
# DATABASE_URL
echo 'postgresql://...' | npx vercel env add DATABASE_URL production

# ADMIN_PASSWORD
echo 'YourSecurePassword' | npx vercel env add ADMIN_PASSWORD production
```

### Redeploy
```bash
npx vercel --prod --yes
```

## 🎨 Branding Customization

Upload custom branding assets via Admin Dashboard → Settings → Branding:
1. **Logo** - Company logo (displays in header and PDF)
2. **Stamp** - Official stamp (appears on stamped PDF versions)
3. **Watermark** - Background watermark for PDFs

Default images should be placed in `/public`:
- `/public/logo.png`
- `/public/stamp.png`
- `/public/watermark.png`

## 💰 Pricing Configuration

Admins can configure pricing for all program types via Settings → Pricing:
- Bachelor / Language Program
- Master / PhD
- Special (March + September)
- Resident Students in China

Dynamic pricing is also configured in `src/constants.tsx` with monthly price tables.

## 🔒 Security Notes

- Admin password is stored in environment variable (not in code)
- API routes validate admin password via headers
- Customer contract submission does NOT require authentication
- Database credentials are environment variables
- All database operations use parameterized queries (SQL injection protection)

## 📝 Key Files

- `src/App.tsx` - Main application with multi-step flow
- `src/components/AdminDashboard.tsx` - Admin contract management
- `src/components/AdminSettings.tsx` - Settings and seller management
- `src/constants.tsx` - Contract content and pricing tables (Arabic)
- `api/contracts.ts` - Contract CRUD API
- `api/sellers.ts` - Seller management API
- `api/db.ts` - Database connection and table setup

## 🐛 Troubleshooting

### Build fails with Tailwind error
- Make sure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` uses `@tailwindcss/postcss`

### Database connection fails
- Verify `DATABASE_URL` environment variable is set
- Check Supabase connection string is correct
- Ensure tables are created (self-healing on first API call)

### Admin login fails
- Verify `ADMIN_PASSWORD` environment variable is set
- Check password in login form matches exactly
- Redeploy after setting environment variables

## 📜 License

Proprietary - Foorsa (Opportunity Solutions SARL)

## 👤 Author

**Mehdi El Ihsani**
- Email: mehdi@foorsa.ma
- Company: Foorsa (Opportunity Solutions SARL)

---

Built with ❤️ for Foorsa students and sellers
