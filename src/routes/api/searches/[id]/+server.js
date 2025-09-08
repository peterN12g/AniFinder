import { json, error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { query } from '$lib/db';

export async function DELETE({ request, params }) {
  const auth = request.headers.get('authorization');
  if (!auth) throw error(401, 'Missing Authorization header');

  const token = auth.split(' ')[1];
  if (!token) throw error(401, 'Token not provided');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    throw error(403, 'Invalid or expired token');
  }

  const searchId = params.id;
  if (!searchId) throw error(400, 'Search ID is required');

  try {
    const result = await query(
      'DELETE FROM saved_searches WHERE id = ? AND userId = ?',
      [searchId, payload.userId]
    );

    if (result.affectedRows === 0) {
      throw error(404, 'Search not found or unauthorized');
    }

    return json({ message: 'Search deleted successfully' });
  } catch (err) {
    console.error('DB Error deleting search:', err.message);
    throw error(500, 'Failed to delete search');
  }
}