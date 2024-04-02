// pages/api/update-metadata.js
import { updateUserMetadata } from '../../lib/database'; // Import your database library

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userEmail, randyBalance } = req.body;

    try {
      // Update user metadata in your database
      await updateUserMetadata(userEmail, { randyBalance });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating user metadata:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}