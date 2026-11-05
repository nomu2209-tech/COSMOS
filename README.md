# Cosmos Gaming & Esports Cafe Mumbai

[![Live Website](https://img.shields.io/badge/Live%20Website-cosmos--gaming.embarko.app-00f2fe?style=for-the-badge&logo=googlechrome&logoColor=white)](https://cosmos-gaming.embarko.app)
[![Admin Portal](https://img.shields.io/badge/Admin%20Portal-Live%20CMS-ea580c?style=for-the-badge&logo=shield&logoColor=white)](https://cosmos-gaming.embarko.app/login)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Embarko Deployed](https://img.shields.io/badge/Hosted%20on-Embarko.ai-7928CA?style=for-the-badge)](https://embarko.ai)

> Mumbai's premier gaming lounge & esports centre featuring 360° VR Tactical Gun Pods, PlayStation 5 4K Arenas, 240Hz High-End PC Esports Battlegrounds, and Force-Feedback Steering Wheel Racing Simulators in Bandra East, Mumbai.

---

## 🌐 Live Production Links

- **Main Website**: [https://cosmos-gaming.embarko.app](https://cosmos-gaming.embarko.app)
- **Book a Slot**: [https://cosmos-gaming.embarko.app/book](https://cosmos-gaming.embarko.app/book)
- **Community & Leaderboards**: [https://cosmos-gaming.embarko.app/community](https://cosmos-gaming.embarko.app/community)
- **Admin Control Panel**: [https://cosmos-gaming.embarko.app/login](https://cosmos-gaming.embarko.app/login)

---

## 🎮 Key Features

- **Real-Time Slot Booking Engine**: 
  - Dynamic slot availability checking across 18 specialized gaming stations (VR, PS5, PC, Racing Sim).
  - Promo code discounts (`COSMOSBOGO`, `STUDENT15`).
  - Cash at counter, UPI, and instant digital booking confirmations.
- **Shop & Cafe Admin Control Hub**:
  - Live revenue analytics, 30-day performance trends, and average ticket tracking.
  - Real-time station occupancy monitoring (VR Gun Arena, 4K PS5, 240Hz PCs, Simulators).
  - Full CRUD CMS for Tournaments, Pricing Passes, Offers, Games Catalog, Photo Gallery, Customer Directory, and Reviews.
- **Enterprise-Grade Security**:
  - Full PostgreSQL Row-Level Security (RLS) policies on Supabase.
  - JWT session verification with server-side HTTP-only cookies.
  - Role-based route middleware protecting all `/admin` and `/api/admin/*` endpoints.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript 5.8
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS with Frosted Glassmorphism UI & responsive design
- **Hosting**: Embarko Managed Cloud (`https://cosmos-gaming.embarko.app`)
- **Icons & Animation**: Lucide React & CSS hardware-accelerated transitions

---

## 🚀 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/nomu2209-tech/COSMOS.git
   cd COSMOS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://smasvdcvqhvjgfgjlvwy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_key
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   JWT_SECRET=your_jwt_secret
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📍 Location & Contact

- **Venue**: Office No. 23, New Shopping Centre, Government Colony, Bandra East, Mumbai - 400051
- **Hours**: 11:00 AM – 11:00 PM (Monday – Sunday)
- **Phone / WhatsApp**: +91 97694 64603
