import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, ensureTables, verifyAdminPassword } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  await ensureTables();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid contract ID' });
  }

  // Admin auth required for all operations
  const password = (req.headers['x-admin-password'] as string) || '';
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET - Fetch single contract
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM esign_contracts WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error fetching contract:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // PATCH - Update contract status
  if (req.method === 'PATCH') {
    try {
      const { status } = req.body;

      if (!status || !['signed', 'pending', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const result = await pool.query(
        `UPDATE esign_contracts 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Contract not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error updating contract:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
