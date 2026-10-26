const prisma = require('../prismaClient');

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, organizer, category } = req.body;
    if (!title || !date || !location) {
      return res.status(400).json({ error: 'Title, date, and location are required' });
    }
    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        date,
        location,
        organizer: organizer || 'Neighbor',
        category: category || 'General',
        attendees: 1
      }
    });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        attendees: { increment: 1 }
      }
    });
    res.json(event);
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({ error: 'Failed to update RSVP count' });
  }
};
