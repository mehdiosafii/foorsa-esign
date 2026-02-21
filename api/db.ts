import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  return pool;
}

// Self-healing tables (CREATE IF NOT EXISTS)
export async function ensureTables(): Promise<void> {
  const pool = getPool();
  
  await pool.query(`
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
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS esign_sellers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

// Helper to verify admin password
export function verifyAdminPassword(password: string): boolean {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FoorsaContract2026!';
  return password === ADMIN_PASSWORD;
}
