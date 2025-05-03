const Event = require('../../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
  try {
    const { eventType, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = {};
    if (eventType) filter.eventType = eventType;
    
    // Filter by date range if provided
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.endDate = { $lte: new Date(endDate) };
    }
    
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('attendees.user', 'name email')
      .sort({ startDate: 1 });
      
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('attendees.user', 'name email');
      
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      eventType, 
      startDate, 
      endDate, 
      location, 
      imageUrl, 
      organizer 
    } = req.body;
    
    // Create event
    const event = await Event.create({
      title,
      description,
      eventType,
      startDate,
      endDate,
      location,
      imageUrl,
      organizer,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Make sure user is the event creator
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this event'
      });
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Make sure user is the event creator
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this event'
      });
    }
    
    await event.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpToEvent = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['going', 'maybe', 'not-going'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status: going, maybe, or not-going'
      });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Check if user has already RSVPed
    const alreadyRSVPed = event.attendees.find(
      a => a.user.toString() === req.user.id
    );
    
    if (alreadyRSVPed) {
      // Update existing RSVP
      event.attendees.forEach(a => {
        if (a.user.toString() === req.user.id) {
          a.status = status;
        }
      });
    } else {
      // Add new RSVP
      event.attendees.push({
        user: req.user.id,
        status
      });
    }
    
    await event.save();
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get events for calendar
// @route   GET /api/events/calendar
// @access  Private
const getCalendarEvents = async (req, res) => {
  try {
    const { year, month } = req.query;
    
    let startDate, endDate;
    
    if (year && month) {
      // Get events for a specific month
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else {
      // Default to current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    const events = await Event.find({
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { 
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: endDate } }
          ]
        }
      ]
    }).select('title startDate endDate eventType');
    
    // Format events for calendar
    const calendarEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      eventType: event.eventType
    }));
    
    res.status(200).json({
      success: true,
      data: calendarEvents
    });
  } catch (error) {
    console.error('Error getting calendar events:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  getCalendarEvents
}; 