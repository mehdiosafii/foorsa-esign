import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, ensureTables, verifyAdminPassword } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  await ensureTables();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Admin auth required for all operations
  const password = (req.headers['x-admin-password'] as string) || '';
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET - List all sellers
  if (req.method === 'GET') {
    try {
      const result = await pool.query(`
        SELECT 
          s.id, s.code, s.name, s.email, s.phone, s.is_active, s.created_at,
          COUNT(c.id) as contract_count
        FROM esign_sellers s
        LEFT JOIN esign_contracts c ON c.seller_code = s.code
        GROUP BY s.id, s.code, s.name, s.email, s.phone, s.is_active, s.created_at
        ORDER BY s.created_at DESC
      `);

      return res.status(200).json(result.rows);
    } catch (error: any) {
      console.error('Error fetching sellers:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - Create new seller
  if (req.method === 'POST') {
    try {
      const { code, name, email, phone } = req.body;

      if (!code || !name) {
        return res.status(400).json({ error: 'Code and name are required' });
      }

      const result = await pool.query(
        `INSERT INTO esign_sellers (code, name, email, phone, is_active)
         VALUES ($1, $2, $3, $4, true)
         RETURNING *`,
        [code.toLowerCase(), name, email || null, phone || null]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error: any) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Seller code already exists' });
      }
      
      console.error('Error creating seller:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
