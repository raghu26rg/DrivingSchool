import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'student'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    // Admin specific
    password: {
      type: String,
      required: function () {
        return this.role === 'admin';
      },
    },
    // Student specific
    trainingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Setting',
    },
    vehicleAssigned: {
      type: String,
    },
    instructorName: {
      type: String,
    },
    totalDays: {
      type: Number,
      default: 26,
    },
    daysCompleted: {
      type: Number,
      default: 0,
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active',
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
    // Financial Details
    totalFee: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card', 'cash_upi', 'pending'],
      default: 'pending',
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);

// Virtual field for payment status
userSchema.virtual('paymentStatus').get(function () {
  if (this.role !== 'student') return null;
  if (this.totalFee === 0) return 'pending'; // Default state if fees not yet set
  if (this.paidAmount >= this.totalFee) return 'paid';
  if (this.paidAmount > 0 && this.paidAmount < this.totalFee) return 'partial';
  return 'unpaid';
});

export default mongoose.model('User', userSchema);
