const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');

router.get('/', eventsController.getEvents);
router.post('/', eventsController.createEvent);
router.post('/:id/rsvp', eventsController.rsvpEvent);

module.exports = router;
