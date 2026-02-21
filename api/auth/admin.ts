import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAdminPassword } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const isValid = verifyAdminPassword(password);

    if (isValid) {
      return res.status(200).json({ success: true, message: 'Authentication successful' });
    } else {
      return res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error: any) {
    console.error('Error in admin auth:', error);
    return res.status(500).json({ error: error.message });
  }
}
