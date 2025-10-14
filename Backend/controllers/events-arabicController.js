import EventArabic from '../models/events-arabic.js';

// Create Arabic event
export const createEventArabic = async (req, res) => {
  try {
  const { title, description, date, location, time } = req.body;
    const image = req.files?.image?.[0]?.path;
    const additionalImages = req.files?.additionalImages ? req.files.additionalImages.map(f => f.path) : [];
    const event = new EventArabic({
      title,
      description,
      date,
      time,
      location,
      image,
      additionalImages,
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
      publishedAt: req.body.isPublished === 'true' || req.body.isPublished === true ? new Date() : null
    });
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Arabic event', details: error.message });
  }
};

// Get all Arabic events
export const getAllEventsArabic = async (req, res) => {
  try {
    const events = await EventArabic.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Arabic events' });
  }
};

// Get Arabic event by ID
export const getEventArabicById = async (req, res) => {
  try {
    const event = await EventArabic.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Arabic event by ID' });
  }
};

// Update Arabic event by ID
export const updateEventArabic = async (req, res) => {
  try {
  const update = req.body;
  if (req.body.time !== undefined) update.time = req.body.time;
    if (req.files?.image?.[0]) update.image = req.files.image[0].path;
    if (req.files?.additionalImages) update.additionalImages = req.files.additionalImages.map(f => f.path);
    const event = await EventArabic.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update Arabic event' });
  }
};

// Delete Arabic event by ID
export const deleteEventArabic = async (req, res) => {
  try {
    const event = await EventArabic.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete Arabic event' });
  }
};
