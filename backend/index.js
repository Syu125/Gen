require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const User = require('./models/users');
const Event = require('./models/events');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Test DB Route
app.get('/test-db', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT NOW()');
    res.json(rows[0]);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    const newUser = await User.create({ email, name, googleId });
    res.status(201).json(newUser);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a user by email
app.get('/api/users/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all events for a user
app.get('/api/users/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.findByCreator(id);
    res.json(events);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, creatorId } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      creatorId,
    });
    res.status(201).json(newEvent);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get an event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
