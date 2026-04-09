import Setting from '../models/Setting.js';

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new setting
// @route   POST /api/settings
// @access  Private/Admin
export const createSetting = async (req, res) => {
  const { type, name, value, description, isActive } = req.body;
  try {
    const setting = await Setting.create({
      type,
      name,
      value,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update setting
// @route   PUT /api/settings/:id
// @access  Private/Admin
export const updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);

    if (setting) {
      setting.name = req.body.name || setting.name;
      setting.value = req.body.value !== undefined ? req.body.value : setting.value;
      setting.isActive = req.body.isActive !== undefined ? req.body.isActive : setting.isActive;
      setting.description = req.body.description || setting.description;

      const updatedSetting = await setting.save();
      res.json(updatedSetting);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:id
// @access  Private/Admin
export const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (setting) {
      await Setting.deleteOne({ _id: setting._id });
      res.json({ message: 'Setting removed' });
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
