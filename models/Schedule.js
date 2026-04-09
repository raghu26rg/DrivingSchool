import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true, // e.g., "Morning Batch A"
    },
    instructor: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // "07:00 AM"
    },
    endTime: {
      type: String,
      required: true, // "08:00 AM"
    },
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Schedule', scheduleSchema);
