import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'excused'],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure a student only has one attendance record per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
