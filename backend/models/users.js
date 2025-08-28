const db = require('../db');

const User = {
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  async findByGoogleId(googleId) {
    const { rows } = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return rows[0];
  },

  async create({ email, name, googleId }) {
    const { rows } = await db.query(
      'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
      [email, name, googleId]
    );
    return rows[0];
  },
};

module.exports = User;
