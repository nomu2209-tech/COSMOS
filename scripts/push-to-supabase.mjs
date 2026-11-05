import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load environment variables from .env.local if present
const envLocalPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...vals] = trimmed.split("=");
      const val = vals.join("=").trim().replace(/^["']|["']$/g, "");
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function pushDirectPostgres() {
  console.log("Connecting directly to Supabase PostgreSQL via DATABASE_URL...");
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL successfully.");

    const schemaPath = path.join(rootDir, "supabase", "schema.sql");
    const seedPath = path.join(rootDir, "supabase", "seed.sql");

    if (fs.existsSync(schemaPath)) {
      console.log("Applying schema from supabase/schema.sql...");
      const schemaSql = fs.readFileSync(schemaPath, "utf-8");
      await client.query(schemaSql);
      console.log("Schema applied successfully.");
    }

    if (fs.existsSync(seedPath)) {
      console.log("Applying initial seed data from supabase/seed.sql...");
      const seedSql = fs.readFileSync(seedPath, "utf-8");
      await client.query(seedSql);
      console.log("Seed data applied successfully.");
    }

    console.log("\nDATABASE SUCCESSFULLY PUSHED TO SUPABASE!");
  } catch (err) {
    console.error("Postgres execution error:", err);
  } finally {
    await client.end();
  }
}

async function pushViaRestClient() {
  console.log("Attempting data push via Supabase REST Client...");
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false },
  });

  const localDataPath = path.join(rootDir, ".data", "cosmos_data.json");
  if (!fs.existsSync(localDataPath)) {
    console.error("Local data file .data/cosmos_data.json not found.");
    return;
  }

  const localData = JSON.parse(fs.readFileSync(localDataPath, "utf-8"));
  const tables = Object.keys(localData);

  console.log(`Found ${tables.length} tables in local storage.`);

  for (const table of tables) {
    const records = localData[table];
    if (!Array.isArray(records) || records.length === 0) continue;

    console.log(`Syncing ${records.length} records to table '${table}'...`);
    try {
      const { error } = await supabase.from(table).upsert(records);
      if (error) {
        console.warn(`  Warning for '${table}': ${error.message}`);
        console.warn(`  Hint: If table does not exist, run 'supabase/schema.sql' in the Supabase SQL Editor.`);
      } else {
        console.log(`  Table '${table}' synced successfully.`);
      }
    } catch (err) {
      console.warn(`  Exception for '${table}':`, err.message);
    }
  }

  console.log("\nSupabase REST push complete.");
}

async function main() {
  console.log("==========================================");
  console.log("   COSMOS GAMING -> SUPABASE DATA PUSH    ");
  console.log("==========================================\n");

  if (DATABASE_URL && !DATABASE_URL.includes("your-password")) {
    await pushDirectPostgres();
  } else if (
    SUPABASE_URL &&
    SUPABASE_KEY &&
    !SUPABASE_URL.includes("your-project-id") &&
    SUPABASE_URL.startsWith("http")
  ) {
    await pushViaRestClient();
  } else {
    console.log("No valid DATABASE_URL or active SUPABASE credentials detected.");
    console.log("\nTo push your database to Supabase, you have 2 easy options:\n");
    console.log("OPTION 1 (Instant via Supabase Web Dashboard):");
    console.log("  1. Go to your Supabase Project: https://supabase.com/dashboard");
    console.log("  2. Click on 'SQL Editor' in the left menu.");
    console.log("  3. Copy and run the contents of 'supabase/schema.sql'.");
    console.log("  4. Copy and run the contents of 'supabase/seed.sql'.");
    console.log("\nOPTION 2 (Automated CLI push):");
    console.log("  1. Get your Postgres connection string from Supabase -> Project Settings -> Database -> URI");
    console.log("  2. Add DATABASE_URL to your .env.local file");
    console.log("  3. Run: npm run db:push\n");
  }
}

main().catch(console.error);

