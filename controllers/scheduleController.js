import Schedule from '../models/Schedule.js';

// @desc    Get all schedules
// @route   GET /api/schedules
// @access  Private/Admin
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({}).sort({ createdAt: -1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new schedule (Batch)
// @route   POST /api/schedules
// @access  Private/Admin
export const createSchedule = async (req, res) => {
  try {
    const { className, instructor, startTime, endTime, days, startDate, endDate } = req.body;

    const schedule = await Schedule.create({
      className,
      instructor,
      startTime,
      endTime,
      days,
      startDate,
      endDate
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a schedule
// @route   PUT /api/schedules/:id
// @access  Private/Admin
export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (schedule) {
      schedule.className = req.body.className || schedule.className;
      schedule.instructor = req.body.instructor || schedule.instructor;
      schedule.startTime = req.body.startTime || schedule.startTime;
      schedule.endTime = req.body.endTime || schedule.endTime;
      schedule.days = req.body.days || schedule.days;
      
      if (req.body.startDate) schedule.startDate = req.body.startDate;
      if (req.body.endDate !== undefined) schedule.endDate = req.body.endDate;
      if (req.body.active !== undefined) schedule.active = req.body.active;

      const updatedSchedule = await schedule.save();
      res.json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a schedule
// @route   DELETE /api/schedules/:id
// @access  Private/Admin
export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (schedule) {
      await Schedule.findByIdAndDelete(schedule._id);
      res.json({ message: 'Schedule removed' });
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
