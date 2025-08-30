require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const User = require('./models/users');
const Event = require('./models/events');
const Driver = require('./models/drivers');
const Passenger = require('./models/passengers');
const Attendee = require('./models/attendees');
const logger = require('./logger');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploaded files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

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
    const { title, description, date, location, imageUrl, creatorId } =
      req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      imageUrl,
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

// Get an event by code
app.get('/api/events/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const event = await Event.findByCode(code);
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

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the URL of the uploaded image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sign-up as Driver
app.post('/api/sign-up/driver', async (req, res) => {
  try {
    const { userId, eventId, leavingFrom, comingBackTo, capacity } = req.body;
    const newDriver = await Driver.create({ userId, eventId, leavingFrom, comingBackTo, capacity });
    res.status(201).json(newDriver);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sign-up as Passenger
app.post('/api/sign-up/passenger', async (req, res) => {
  try {
    const { userId, eventId, pickupAt, dropoffAt } = req.body;
    const newPassenger = await Passenger.create({ userId, eventId, pickupAt, dropoffAt });
    res.status(201).json(newPassenger);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sign-up as Attendee
app.post('/api/sign-up/attendee', async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const newAttendee = await Attendee.create({ userId, eventId });
    res.status(201).json(newAttendee);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${PORT}`);
});
