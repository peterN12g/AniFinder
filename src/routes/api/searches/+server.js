import { json, error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { query } from '$lib/db';

export async function POST({ request }) {
  const auth = request.headers.get('authorization');
  console.log('AUTH HEADER:', auth);
  if (!auth) throw error(401, 'Missing Authorization header');

  const token = auth.split(' ')[1];
  console.log('TOKEN EXTRACTED:', token);
  if (!token) throw error(401, 'Token not provided');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('JWT payload:', payload);
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    throw error(403, 'Invalid or expired token');
  }

  const { prompt, genre, result } = await request.json();

  if (!prompt || !genre || !result) {
    throw error(400, 'Missing search data');
  }

  try {
    await query(
      'INSERT INTO saved_searches (userId, prompt, genre, result) VALUES (?, ?, ?, ?)',
      [payload.userId, prompt, genre, result]
    );

    return json({ message: 'Search saved successfully' });
  } catch (err) {
    console.error('DB Error:', err.message);
    throw error(500, 'Failed to save search');
  }
}
