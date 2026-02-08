# TeaCom - Premium E-Commerce Platform

TeaCom is a modern, full-featured e-commerce application designed for selling premium tea products. Built with the latest web technologies, it offers a seamless shopping experience for customers and a powerful dashboard for administrators.

## 🚀 Key Features

### 🛍️ Customer Storefront
- **Modern UI/UX**: Responsive design with clean aesthetics using Tailwind CSS.
- **Product Discovery**: Advanced filtering, search, and categorization (Bestsellers, New Arrivals).
- **Product Details**: Rich product pages with ingredient lists, health benefits, and variant selection.
- **Shopping Experience**: 
  - Cart management.
  - **Multi-Currency Support** (INR & SAR).
  - Secure checkout flow.
  - Wishlist functionality.
  - Order tracking system.
- **Blog**: educational content integration about tea culture.

### 🛡️ Authentication & User Accounts
- **Secure Auth**: Powered by Supabase Auth.
- **Role-Based Access**: Distinct distinct permissions for Customers and Administrators.
- **User Dashboard**: Order history, profile management, and saved addresses.

### ⚡ Admin Dashboard
- **Product Management**: Create, edit, and delete products with image support.
- **Order Management**: View orders, update shipping status, and process refunds.
- **Analytics**: Visual sales reports, revenue tracking, and order statistics.
- **Marketing**: 
  - Coupon code generation and usage tracking.
  - System-wide notification broadcasting.
- **Content Management**: Built-in blog post editor.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix UI based)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Email**: [Resend](https://resend.com/)
- **Monitoring**: [Sentry](https://sentry.io/)
- **Reporting**: jsPDF (PDF generation), XLSX (Excel export)

## 📂 Project Structure

```bash
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Authentication routes (login)
│   ├── (shop)/          # Main storefront routes
│   └── admin/           # Admin dashboard routes
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── emails/          # Email templates
│   ├── shop/            # Storefront components
│   └── ui/              # Base UI components (buttons, inputs, etc.)
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and client setup
│   └── supabase/        # Supabase client configurations
├── types/               # TypeScript type definitions (Database, etc.)
├── services/            # Business logic and API calls
├── middleware.ts        # Next.js Middleware (Auth protection)
└── env.ts               # Type-safe environment variables
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/teacom.git
   cd teacom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory (or use `.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the SQL scripts located in the `supabase/` directory in your Supabase SQL Editor to set up the tables and policies. Start with `schema.sql` and `seed.sql`.

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🗄️ Database Schema

The project uses a comprehensive PostgreSQL schema including:
- `products`: Main product catalog.
- `product_variants` & `product_prices`: SKU and pricing management.
- `orders` & `order_items`: specific transactional data.
- `profiles`: User profile extensions.
- `cart` custom logic (often client-side or separate table depending on implementation).
- `notifications`, `coupons`, `wishlists`, `posts` (blog).

Check `src/types/database.types.ts` for the full type definitions.

## 📚 Documentation
- [Database Schema](./docs/DATABASE.md) - Detailed breakdown of tables and relationships.
- [Implementation Plan](./implementation_plan.md) - Current status and roadmap.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT
