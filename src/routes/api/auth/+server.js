import { query } from '$lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { json, error } from '@sveltejs/kit';

export async function POST({ request }) {
    const { action, username, password, displayName } = await request.json();

	if (!username || !password) {
		throw error(400, 'Username and password are required');
	}

	if (action === 'register') {
		try {
			const existing = await query('SELECT * FROM users WHERE username = ?', [username]);
			if (existing.length > 0) {
				throw error(400, 'Username already exists');
			}

			const hashed = await bcrypt.hash(password, 10);
			await query(
				'INSERT INTO users (username, password, displayName) VALUES (?, ?, ?)',
				[username, hashed, displayName || username]
			);

			return json({ message: 'User registered successfully' });
		} catch (err) {
			throw error(500, err.message || 'Registration failed');
		}
	}

	if (action === 'login') {
		try {
			const users = await query('SELECT * FROM users WHERE username = ?', [username]);
			if (users.length === 0) throw error(401, 'Invalid username or password');

			const valid = await bcrypt.compare(password, users[0].password);
			if (!valid) throw error(401, 'Invalid username or password');

			const token = jwt.sign(
				{ userId: users[0].userId, username: users[0].username },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);

			return json({ token, displayName: users[0].displayName });
		} catch (err) {
			throw error(500, err.message || 'Login failed');
		}
	}

	throw error(400, 'Invalid action');
}