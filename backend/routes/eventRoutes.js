const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  rsvpToEvent,
  getCalendarEvents
} = require('../controllers/events/eventController');
const { protect } = require('../middleware/authMiddleware');

// Event routes
router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.route('/:id')
  .get(protect, getEvent)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

// RSVP
router.route('/:id/rsvp')
  .post(protect, rsvpToEvent);

// Calendar integration
router.route('/calendar')
  .get(protect, getCalendarEvents);

module.exports = router; 