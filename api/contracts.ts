import { VercelRequest, VercelResponse } from '@vercel/node';
import { getPool, ensureTables, verifyAdminPassword } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const pool = getPool();
  
  // Ensure tables exist
  await ensureTables();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - List all contracts (requires admin auth)
  if (req.method === 'GET') {
    const password = (req.headers['x-admin-password'] as string) || '';
    
    if (!verifyAdminPassword(password)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { seller_code } = req.query;
      
      let query = `
        SELECT 
          id, student_full_name, student_national_id, student_birth_date,
          student_phone, student_email, guardian_name, guardian_id,
          program, fees_dossier, fees_service, fees_total,
          signature_data, signed_at, ip_address, status,
          seller_code, seller_name, created_at, updated_at
        FROM esign_contracts
      `;
      
      const params: any[] = [];
      
      if (seller_code) {
        query += ' WHERE seller_code = $1';
        params.push(seller_code);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      
      return res.status(200).json(result.rows);
    } catch (error: any) {
      console.error('Error fetching contracts:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - Create new contract (NO auth required - customer submission)
  if (req.method === 'POST') {
    try {
      const {
        studentInfo,
        signatureDataUrl,
        ipAddress,
        sellerCode,
        sellerName,
      } = req.body;

      if (!studentInfo || !signatureDataUrl) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await pool.query(
        `INSERT INTO esign_contracts (
          student_full_name, student_national_id, student_birth_date,
          student_phone, student_email, guardian_name, guardian_id,
          program, fees_dossier, fees_service, fees_total,
          signature_data, ip_address, status,
          seller_code, seller_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [
          studentInfo.fullName,
          studentInfo.nationalId,
          studentInfo.birthDate || null,
          studentInfo.phone || null,
          studentInfo.email || null,
          studentInfo.guardianName || null,
          studentInfo.guardianId || null,
          studentInfo.program,
          studentInfo.fees?.dossier || 0,
          studentInfo.fees?.serviceBase || 0,
          studentInfo.fees?.total || 0,
          signatureDataUrl,
          ipAddress || null,
          'signed',
          sellerCode || null,
          sellerName || null,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Error creating contract:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
