import fs from "fs";
import path from "path";
import { supabase, isSupabaseConfigured } from "./supabase";
import {
  User,
  VerificationOtp,
  GamingZone,
  Station,
  Game,
  PricingTier,
  Offer,
  EventTournament,
  EventRegistration,
  Booking,
  Review,
  GalleryImage,
  BusinessSettings,
} from "@/types";

export interface DatabaseSchema {
  users: User[];
  verification_otps: VerificationOtp[];
  gaming_zones: GamingZone[];
  stations: Station[];
  games: Game[];
  pricing_tiers: PricingTier[];
  offers: Offer[];
  events: EventTournament[];
  event_registrations: EventRegistration[];
  bookings: Booking[];
  reviews: Review[];
  gallery_images: GalleryImage[];
  business_settings: BusinessSettings[];
}

const dbDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dbDir, "cosmos_data.json");

function ensureDbDir() {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

export function readLocalData(): DatabaseSchema {
  ensureDbDir();
  if (fs.existsSync(dbPath)) {
    try {
      const raw = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error reading local database file:", error);
    }
  }
  return {
    users: [],
    verification_otps: [],
    gaming_zones: [],
    stations: [],
    games: [],
    pricing_tiers: [],
    offers: [],
    events: [],
    event_registrations: [],
    bookings: [],
    reviews: [],
    gallery_images: [],
    business_settings: [],
  };
}

export function saveLocalData(data: DatabaseSchema) {
  try {
    ensureDbDir();
    const tempPath = `${dbPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempPath, dbPath);
  } catch (error) {
    console.error("Error saving local database file:", error);
  }
}

export const db = {
  /**
   * Find multiple records. Uses Supabase if connected, otherwise local JSON store.
   */
  async findMany<K extends keyof DatabaseSchema>(
    table: K,
    filterFn?: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<DatabaseSchema[K]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from(table).select("*");
        if (!error && Array.isArray(data) && data.length > 0) {
          if (!filterFn) return data as DatabaseSchema[K];
          return (data as any[]).filter(filterFn) as DatabaseSchema[K];
        }
      } catch (err) {
        console.warn(`[Supabase] findMany fallback for table ${table}:`, err);
      }
    }

    const localData = readLocalData();
    const items = localData[table] || [];
    if (!filterFn) return items as DatabaseSchema[K];
    return (items as any[]).filter(filterFn) as DatabaseSchema[K];
  },

  /**
   * Find a single record.
   */
  async findOne<K extends keyof DatabaseSchema>(
    table: K,
    filterFn: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<DatabaseSchema[K][number] | null> {
    const items = await this.findMany(table, filterFn);
    return items.length > 0 ? items[0] : null;
  },

  /**
   * Insert a new record into Supabase and local cache.
   */
  async insert<K extends keyof DatabaseSchema>(
    table: K,
    item: DatabaseSchema[K][number]
  ): Promise<DatabaseSchema[K][number]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(table).insert(item);
        if (error) {
          console.warn(`[Supabase] insert warning for table ${table}:`, error.message);
        }
      } catch (err) {
        console.warn(`[Supabase] insert exception for table ${table}:`, err);
      }
    }

    const localData = readLocalData();
    if (!localData[table]) {
      (localData as any)[table] = [];
    }
    (localData[table] as any[]).push(item);
    saveLocalData(localData);
    return item;
  },

  /**
   * Update an existing record.
   */
  async update<K extends keyof DatabaseSchema>(
    table: K,
    id: string,
    updates: Partial<DatabaseSchema[K][number]>
  ): Promise<DatabaseSchema[K][number] | null> {
    const updatedWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from(table)
          .update(updatedWithTimestamp)
          .eq("id", id);
        if (error) {
          console.warn(`[Supabase] update warning for table ${table}:`, error.message);
        }
      } catch (err) {
        console.warn(`[Supabase] update exception for table ${table}:`, err);
      }
    }

    const localData = readLocalData();
    const items = (localData[table] || []) as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updatedWithTimestamp };
    saveLocalData(localData);
    return items[index];
  },

  /**
   * Delete a record by ID.
   */
  async delete<K extends keyof DatabaseSchema>(table: K, id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) {
          console.warn(`[Supabase] delete warning for table ${table}:`, error.message);
        }
      } catch (err) {
        console.warn(`[Supabase] delete exception for table ${table}:`, err);
      }
    }

    const localData = readLocalData();
    const items = (localData[table] || []) as any[];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    items.splice(index, 1);
    saveLocalData(localData);
    return true;
  },

  /**
   * Count records.
   */
  async count<K extends keyof DatabaseSchema>(
    table: K,
    filterFn?: (item: DatabaseSchema[K][number]) => boolean
  ): Promise<number> {
    const items = await this.findMany(table, filterFn);
    return items.length;
  },
};

export default db;
