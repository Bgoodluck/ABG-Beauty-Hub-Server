import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cellNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  salonLocation: {
    type: String,
    required: true
  },
  firstTimeClient: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  requestDate: {
    type: Date,
    required: true
  },
  requestTime: {
    type: String,
    required: true
  },
  stylistName: {
    type: String
  },
  services: {
    type: String
  },
  keepUpdated: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

const AppointmentModel = mongoose.models.AppointmentModel || mongoose.model('Appointment', appointmentSchema);

export default AppointmentModel;