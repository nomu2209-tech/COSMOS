-- ============================================================================
-- COSMOS GAMING & ESPORTS LOUNGE - COMPLETE SUPABASE SETUP
-- Project: smasvdcvqhvjgfgjlvwy
-- Paste this entire script into your Supabase SQL Editor and click "Run"
-- Direct link: https://supabase.com/dashboard/project/smasvdcvqhvjgfgjlvwy/sql/new
-- ============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  "passwordHash" TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  "isEmailVerified" BOOLEAN DEFAULT false,
  "isPhoneVerified" BOOLEAN DEFAULT false,
  "cosmosXp" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Verification OTPs Table
CREATE TABLE IF NOT EXISTS verification_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  "otpCode" TEXT NOT NULL,
  type TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Gaming Zones Table
CREATE TABLE IF NOT EXISTS gaming_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  specs TEXT NOT NULL,
  "hourlyRate" INTEGER NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "totalStations" INTEGER NOT NULL,
  "popularGames" TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "displayOrder" INTEGER NOT NULL
);

-- 4. Stations Table
CREATE TABLE IF NOT EXISTS stations (
  id TEXT PRIMARY KEY,
  "zoneId" TEXT NOT NULL REFERENCES gaming_zones(id) ON DELETE CASCADE,
  "stationNumber" INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE'
);

-- 5. Games Table
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  "zoneType" TEXT NOT NULL,
  "coverUrl" TEXT NOT NULL,
  "isPopular" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  description TEXT
);

-- 6. Pricing Tiers Table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "zoneType" TEXT NOT NULL,
  "durationHours" INTEGER NOT NULL,
  price INTEGER NOT NULL,
  "originalPrice" INTEGER,
  tag TEXT,
  features JSONB NOT NULL,
  "isFeatured" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true
);

-- 7. Offers Table
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  "discountType" TEXT NOT NULL,
  "discountValue" INTEGER NOT NULL,
  "applicableZone" TEXT,
  "minDurationHours" INTEGER,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  terms TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  "bannerUrl" TEXT
);

-- 8. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  game TEXT NOT NULL,
  category TEXT NOT NULL,
  "eventDate" DATE NOT NULL,
  "startTime" TIME NOT NULL,
  "endTime" TIME,
  "entryFee" INTEGER NOT NULL,
  "prizePool" TEXT,
  "maxParticipants" INTEGER NOT NULL,
  "currentParticipants" INTEGER DEFAULT 0,
  format TEXT NOT NULL,
  rules TEXT,
  "bannerUrl" TEXT,
  status TEXT NOT NULL DEFAULT 'UPCOMING'
);

-- 9. Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY,
  "eventId" TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
  "playerName" TEXT NOT NULL,
  "playerPhone" TEXT NOT NULL,
  "playerEmail" TEXT,
  "gamerTag" TEXT,
  "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "bookingRef" TEXT NOT NULL UNIQUE,
  "userId" UUID REFERENCES users(id) ON DELETE SET NULL,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "customerEmail" TEXT,
  "zoneId" TEXT NOT NULL REFERENCES gaming_zones(id) ON DELETE RESTRICT,
  "zoneName" TEXT NOT NULL,
  "stationId" TEXT REFERENCES stations(id) ON DELETE SET NULL,
  "stationNumber" INTEGER,
  "bookingDate" DATE NOT NULL,
  "startTime" TIME NOT NULL,
  "endTime" TIME NOT NULL,
  "durationHours" INTEGER NOT NULL,
  "playersCount" INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  "discountAmount" INTEGER DEFAULT 0,
  "totalAmount" INTEGER NOT NULL,
  "appliedOfferCode" TEXT,
  "paymentMethod" TEXT NOT NULL,
  "paymentStatus" TEXT NOT NULL,
  "bookingStatus" TEXT NOT NULL,
  "specialRequests" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "authorName" TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  "gamePlayed" TEXT,
  "isVerified" BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Gallery Images Table
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  category TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL,
  "isPublished" BOOLEAN DEFAULT true
);

-- 13. Business Settings Table
CREATE TABLE IF NOT EXISTS business_settings (
  id TEXT PRIMARY KEY,
  "businessName" TEXT NOT NULL,
  tagline TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT NOT NULL,
  "googleMapsUrl" TEXT NOT NULL,
  "openingTime" TEXT NOT NULL,
  "closingTime" TEXT NOT NULL,
  "operatingDays" TEXT NOT NULL,
  "isSlotBookingActive" BOOLEAN DEFAULT true,
  "announcementText" TEXT,
  "announcementActive" BOOLEAN DEFAULT false
);

-- ============================================================================
-- INITIAL PRODUCTION SEED DATA
-- ============================================================================

-- Seed Admin and Demo Users
INSERT INTO users (id, name, email, phone, "passwordHash", role, "isEmailVerified", "isPhoneVerified", "cosmosXp", "createdAt", "updatedAt")
VALUES
('b4e4c278-f2b7-4e63-9114-118e950bc450', 'Cosmos Admin', 'admin@cosmosgaming.com', '+919769464603', '$2b$10$b6QTJPZ5i/s2mYDDGFvuGOUK9/YeQGcF3tFZcrCBq26cJKt4bjMPq', 'ADMIN', true, true, 5000, NOW(), NOW()),
('33e9b119-913a-4467-b50a-f10d29f046fa', 'Aryan Sharma', 'aryan@gamer.com', '+919876543210', '$2b$10$Qfy2qsG93qm.BdrHECA8nOybg86vhzrzK7HsVGmm8TosfW3evgNea', 'CUSTOMER', true, true, 450, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Seed Business Profile
INSERT INTO business_settings (id, "businessName", tagline, address, city, state, "postalCode", phone, whatsapp, email, instagram, "googleMapsUrl", "openingTime", "closingTime", "operatingDays", "isSlotBookingActive", "announcementText", "announcementActive")
VALUES
('settings-1', 'Cosmos Gaming Mumbai', 'Mumbai''s Premier VR, PS5 & PC Esports Gaming Centre', 'Office No. 23, New Shopping Centre, Government Colony, Bandra East', 'Mumbai', 'Maharashtra', '400051', '+91 97694 64603', '+91 97694 64603', 'contact@cosmosgamingmumbai.com', 'https://www.instagram.com/cosmosgamingmumbai/', 'https://maps.google.com/?q=Office+No+23+New+Shopping+Centre+Government+Colony+Bandra+East+Mumbai+400051', '11:00 AM', '11:00 PM', 'Monday - Sunday (All 7 Days)', true, 'WELCOME TO COSMOS GAMING CENTRE! Experience 360° VR Tactical Gun Arena & PS5 DualSense 4K Gaming in Bandra East!', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Gaming Zones
INSERT INTO gaming_zones (id, name, slug, description, specs, "hourlyRate", "imageUrl", "totalStations", "popularGames", "isActive", "displayOrder")
VALUES
('zone-vr', 'VR Immersive Arena & Gun Setup', 'vr-immersive', 'Cosmos signature 360-degree virtual reality arena with specialized haptic tactical VR gun controllers for ultra-realistic shooter, horror, and action survival gameplay.', 'Next-Gen 360° VR Headsets • Specialized Haptic VR Gun Peripherals • Room-Scale Tracking Sensors • Dedicated VR Master Assistance', 200, 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&q=80', 2, 'Zombie Outbreak VR, Tactical VR Shooters, Horror World, Beat Saber, Superhot VR, Virtual Cricket Simulator', true, 1),
('zone-ps5', 'PlayStation 5 (PS5) 4K Arena', 'ps5-arena', 'Experience 4K ultra-smooth console gaming on Sony PlayStation 5 with DualSense haptic feedback, 120Hz high-refresh displays, and competitive multiplayer co-op.', 'Sony PlayStation 5 Consoles • 4K HDR 120Hz Displays • DualSense Wireless Controllers • Pulse 3D Audio', 150, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80', 6, 'EA Sports FC 24/25/26, Tekken 8, WWE 2K24/26, Mortal Kombat 1, Marvel''s Spider-Man 2, GTA 5', true, 2),
('zone-pc', 'High-End PC Esports Battleground', 'pc-esports', 'Tournament-grade esports gaming rigs engineered for maximum FPS, zero input latency, and low ping on 240Hz monitors with mechanical RGB peripherals.', 'Dedicated Esports Gaming Rigs • 240Hz High-Refresh Gaming Monitors • Mechanical RGB Keyboards • Ultra-light Gaming Mice • Low-Ping Fiber LAN', 120, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 8, 'Valorant, Counter-Strike 2, GTA 5 RP (FiveM), Apex Legends, Fortnite, Call of Duty', true, 3),
('zone-racing', 'Steering Wheel Racing Simulator', 'racing-simulator', 'Professional force-feedback steering wheel and pedal rig for realistic motorsport, rally, and drift simulation in an ergonomic racing bucket seat.', 'Force-Feedback Racing Wheel • Responsive Pedal System • Ergonomic Bucket Racing Cockpit • Ultra-Wide Immersive Display', 180, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', 2, 'F1 24, Forza Horizon 5, Assetto Corsa, Gran Turismo 7', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Pricing Tiers
INSERT INTO pricing_tiers (id, title, "zoneType", "durationHours", price, "originalPrice", tag, features, "isFeatured", "isActive")
VALUES
('price-pc-1hr', 'PC Quick Session', 'High-End PC Esports', 1, 120, 150, 'Standard', '["240Hz Esports Display", "Mechanical RGB Peripherals", "Discord & Steam Ready", "Zero Input Lag Fiber LAN"]', false, true),
('price-pc-3hr', 'PC Grind Pass (3 Hours)', 'High-End PC Esports', 3, 299, 360, 'Most Popular', '["3 Full Hours Ranked Grind", "Save Rs 61 on Hourly Rate", "High-Speed Low Ping LAN", "Cosmos XP Points Boost"]', true, true),
('price-ps5-1hr', 'PS5 1v1 Arena', 'PlayStation 5 (PS5)', 1, 150, 180, 'Console Match', '["Sony PS5 Console", "4K 120Hz Ultra-HD Display", "2 DualSense Haptic Controllers", "All Top Sports & Fighting Games"]', false, true),
('price-ps5-3hr', 'PS5 Squad Marathon (3 Hours)', 'PlayStation 5 (PS5)', 3, 399, 450, 'Best Value', '["3 Continuous Hours Gaming", "Up to 4 Controllers Available", "Snack & Drink Assistance", "Free Tournament Practice"]', true, true),
('price-vr-sim', 'VR Tactical Gun Experience', 'VR Immersion Arena', 1, 350, 400, 'Signature VR', '["360° VR Room-Scale Arena", "Haptic Tactical VR Gun Rig", "Zombie & Horror Survival Modes", "Dedicated VR Guide Assistance"]', true, true),
('price-racing-1hr', 'Pro Racing Simulator Cockpit', 'Racing Simulator', 1, 180, 220, 'Full Immersion', '["Force-Feedback Steering Wheel", "Responsive Pedal Set", "Bucket Racing Seat Cockpit", "F1 24 & Forza Horizon 5"]', false, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Promotional Offers
INSERT INTO offers (id, title, code, description, "discountType", "discountValue", "applicableZone", "minDurationHours", "startDate", "endDate", terms, status, "bannerUrl")
VALUES
('offer-bogo', 'Buy 1 Hour, Get 1 Hour FREE', 'COSMOSBOGO', 'Special launch promo: Buy 1 hour of gaming on any station and get your 2nd hour 100% FREE.', 'PERCENTAGE', 50, null, 2, '2026-01-01', '2027-12-31', 'Valid on all gaming stations. Mention promo code COSMOSBOGO at reception prior to booking.', 'PUBLISHED', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'),
('offer-squad', 'Squad LAN Pass: Flat 20% Off', 'SQUAD20', 'Book 3 or more stations simultaneously with your squad for 2+ hours and get a flat 20% discount on total booking value.', 'PERCENTAGE', 20, null, 2, '2026-01-01', '2027-12-31', 'Minimum 3 players / stations required. Applicable on PC and PS5 zones.', 'PUBLISHED', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'),
('offer-student', 'Student Gaming Pass: 15% Off', 'STUDENT15', 'Show your valid college or school student ID card at the front desk and enjoy 15% off all weekday gaming sessions.', 'PERCENTAGE', 15, null, 1, '2026-01-01', '2027-12-31', 'Valid Student ID card required at check-in. Valid Monday through Friday.', 'PUBLISHED', 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
