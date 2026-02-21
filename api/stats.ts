import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, ensureTables, verifyAdminPassword } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  await ensureTables();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin auth required
  const password = (req.headers['x-admin-password'] as string) || '';
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Overall stats
    const totalResult = await pool.query(`
      SELECT 
        COUNT(*) as total_contracts,
        COUNT(CASE WHEN status = 'signed' THEN 1 END) as signed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count
      FROM esign_contracts
    `);

    // Per-seller stats
    const sellerStatsResult = await pool.query(`
      SELECT 
        seller_code,
        seller_name,
        COUNT(*) as contract_count,
        COUNT(CASE WHEN status = 'signed' THEN 1 END) as signed_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_count
      FROM esign_contracts
      WHERE seller_code IS NOT NULL
      GROUP BY seller_code, seller_name
      ORDER BY contract_count DESC
    `);

    // Contracts without seller
    const noSellerResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM esign_contracts
      WHERE seller_code IS NULL
    `);

    return res.status(200).json({
      overall: totalResult.rows[0],
      bySeller: sellerStatsResult.rows,
      noSeller: parseInt(noSellerResult.rows[0].count),
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ error: error.message });
  }
}
