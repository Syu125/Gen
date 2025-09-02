const db = require('../db');

class Attendee {
  static async create({ userId, eventId }) {
    const result = await db.query(
      `INSERT INTO attendees (user_id, event_id) VALUES ($1, $2) RETURNING *`,
      [userId, eventId]
    );
    return result.rows[0];
  }

  // You can add more methods here
}

Attendee.findByEventId = async (eventId) => {
  const query = `
    SELECT u.name, 'Attendee' as role
    FROM attendees a
    JOIN users u ON a.user_id = u.id
    WHERE a.event_id = $1
  `;
  const values = [eventId];
  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = Attendee;
