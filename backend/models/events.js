const db = require('../db');

const Event = {
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return rows[0];
  },

  async findByCreator(creatorId) {
    const { rows } = await db.query(
      'SELECT * FROM events WHERE creator_id = $1',
      [creatorId]
    );
    return rows;
  },

  async create({ title, description, date, location, creatorId }) {
    const { rows } = await db.query(
      'INSERT INTO events (title, description, date, location, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, date, location, creatorId]
    );
    return rows[0];
  },
};

module.exports = Event;
