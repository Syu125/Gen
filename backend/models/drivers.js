const db = require('../db');

class Driver {
  static async create({
    userId,
    eventId,
    leavingFrom,
    comingBackTo,
    capacity,
  }) {
    const result = await db.query(
      `INSERT INTO drivers (
        user_id, event_id,
        leaving_from_name, leaving_from_full_address, leaving_from_lat, leaving_from_lng,
        coming_back_to_name, coming_back_to_full_address, coming_back_to_lat, coming_back_to_lng,
        capacity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        eventId,
        leavingFrom.name,
        leavingFrom.fullAddress,
        leavingFrom.lat,
        leavingFrom.lng,
        comingBackTo.name,
        comingBackTo.fullAddress,
        comingBackTo.lat,
        comingBackTo.lng,
        capacity,
      ]
    );
    return result.rows[0];
  }

  // You can add more methods here, e.g., findById, findByEventId, update, delete
}

Driver.findByEventId = async (eventId) => {
  const query = `
    SELECT u.name, d.leaving_from_name as leaving_from, d.coming_back_to_name as coming_back_to, 'Driver' as role
    FROM drivers d
    JOIN users u ON d.user_id = u.id
    WHERE d.event_id = $1
  `;
  const values = [eventId];
  const { rows } = await db.query(query, values);
  return rows;
};

module.exports = Driver;
