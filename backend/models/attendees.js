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

module.exports = Attendee;