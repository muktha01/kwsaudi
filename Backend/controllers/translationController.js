import Translation from '../models/Translation.js';

// Create a new translation
export const createTranslation = async (req, res) => {
  try {
    const { key, value } = req.body;
    const newTranslation = new Translation({ key, value });
    await newTranslation.save();
    res.status(201).json(newTranslation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all translations
export const getTranslations = async (req, res) => {
  try {
    const translations = await Translation.find();
    res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single translation by ID
export const getTranslationById = async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);
    if (!translation) return res.status(404).json({ message: 'Translation not found' });
    res.status(200).json(translation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a translation by ID
export const updateTranslation = async (req, res) => {
  try {
    const { key, value } = req.body;
    const updatedTranslation = await Translation.findByIdAndUpdate(
      req.params.id,
      { key, value },
      { new: true, runValidators: true }
    );
    if (!updatedTranslation) return res.status(404).json({ message: 'Translation not found' });
    res.status(200).json(updatedTranslation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a translation by ID
export const deleteTranslation = async (req, res) => {
  try {
    const deletedTranslation = await Translation.findByIdAndDelete(req.params.id);
    if (!deletedTranslation) return res.status(404).json({ message: 'Translation not found' });
    res.status(200).json({ message: 'Translation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
