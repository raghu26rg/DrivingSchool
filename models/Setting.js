import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    type: {
      type: String, // 'training_type', 'general'
      required: true,
    },
    name: {
      type: String,
      required: true, // e.g., "4-Wheeler Training"
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // e.g., duration in days: 26 or a JSON object
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
