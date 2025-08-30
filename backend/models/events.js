const db = require('../db');
const { generateUniqueCode } = require('../utils/codeGenerator');
const logger = require('../logger');

const Event = {
  async findById(id) {
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return rows[0];
  },

  async findByCode(code) {
    const { rows } = await db.query('SELECT * FROM events WHERE code = $1', [
      code,
    ]);
    return rows[0];
  },

  async findByCreator(creatorId) {
    const { rows } = await db.query(
      'SELECT * FROM events WHERE creator_id = $1',
      [creatorId]
    );
    return rows;
  },

  async create(eventData) {
    const { title, description, date, location, imageUrl, creatorId } =
      eventData;
    const code = generateUniqueCode(6); // Generate a 6-character code
    logger.info('Event data received:', eventData);
    logger.info('Generated code:', code);
    logger.info('Image URL received:', imageUrl);
    const values = [
      code,
      title,
      description,
      date,
      location,
      imageUrl,
      creatorId,
    ];
    logger.info('Values array for query:', values);
    const { rows } = await db.query(
      'INSERT INTO events (code, title, description, date, location, image_url, creator_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      values
    );
    return rows[0];
  },

  async findSignedUpEventsByUserId(userId) {
    const { rows } = await db.query(
      `SELECT DISTINCT e.*,
              CASE
                  WHEN d.user_id IS NOT NULL THEN 'driver'
                  WHEN p.user_id IS NOT NULL THEN 'passenger'
                  WHEN a.user_id IS NOT NULL THEN 'attendee'
                  ELSE NULL
              END as role
       FROM events e
       LEFT JOIN drivers d ON e.id = d.event_id AND d.user_id = $1
       LEFT JOIN passengers p ON e.id = p.event_id AND p.user_id = $1
       LEFT JOIN attendees a ON e.id = a.event_id AND a.user_id = $1
       WHERE d.user_id IS NOT NULL OR p.user_id IS NOT NULL OR a.user_id IS NOT NULL;`,
      [userId]
    );
    return rows;
  },
};

module.exports = Event;
