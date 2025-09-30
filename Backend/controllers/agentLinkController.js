import Link from '../models/AgentLink.js';

// Get all links
export const getLinks = async (req, res) => {
  try {
    const links = await Link.find();
    console.log('Fetching links from database:', links.length, 'found');
    res.json(links);
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ message: err.message });
  }
};

// Create new link
export const createLink = async (req, res) => {
  try {
    const { name, url } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required" });
    }

    const newLink = new Link({ name, url });
    const savedLink = await newLink.save();
    
    console.log('Created new link:', savedLink);
    res.status(201).json(savedLink);
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ message: err.message });
  }
};

// Update link
export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url } = req.body;

    console.log('Updating link:', id, 'with data:', { name, url });

    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { name, url },
      { new: true, runValidators: true }
    );

    if (!updatedLink) {
      console.log('Link not found:', id);
      return res.status(404).json({ message: "Link not found" });
    }

    console.log('Successfully updated link:', updatedLink);
    res.json(updatedLink);
  } catch (err) {
    console.error('Error updating link:', err);
    res.status(500).json({ message: err.message });
  }
};