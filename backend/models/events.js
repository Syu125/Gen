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
};

module.exports = Event;
