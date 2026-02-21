import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, ensureTables, verifyAdminPassword } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  await ensureTables();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid seller ID' });
  }

  // Admin auth required for all operations
  const password = (req.headers['x-admin-password'] as string) || '';
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // PATCH - Update seller
  if (req.method === 'PATCH') {
    try {
      const { name, email, phone, isActive } = req.body;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(email || null);
      }
      if (phone !== undefined) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(phone || null);
      }
      if (isActive !== undefined) {
        updates.push(`is_active = $${paramIndex++}`);
        values.push(isActive);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE esign_sellers 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Seller not found' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error updating seller:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - Delete seller (soft delete by setting is_active = false)
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        `UPDATE esign_sellers 
         SET is_active = false 
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Seller not found' });
      }

      return res.status(200).json({ message: 'Seller deactivated', seller: result.rows[0] });
    } catch (error: any) {
      console.error('Error deleting seller:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
