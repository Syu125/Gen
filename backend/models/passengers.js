const db = require('../db');

class Passenger {
  static async create({ userId, eventId, pickupAt, dropoffAt }) {
    const result = await db.query(
      `INSERT INTO passengers (
        user_id, event_id,
        pickup_at_name, pickup_at_full_address, pickup_at_lat, pickup_at_lng,
        dropoff_at_name, dropoff_at_full_address, dropoff_at_lat, dropoff_at_lng
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userId,
        eventId,
        pickupAt.name,
        pickupAt.fullAddress,
        pickupAt.lat,
        pickupAt.lng,
        dropoffAt.name,
        dropoffAt.fullAddress,
        dropoffAt.lat,
        dropoffAt.lng,
      ]
    );
    return result.rows[0];
  }

  // You can add more methods here
}

module.exports = Passenger;
