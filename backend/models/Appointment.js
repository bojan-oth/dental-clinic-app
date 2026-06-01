const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add a start time'],
    },
    duration: {
      type: Number,
      required: true,
    },
    procedure: {
      type: String,
      required: true,
      enum: [
        'Basic Check-up',
        'Cavity Filling',
        'Deep Cleaning',
        'Tooth Extraction',
        'Root Canal Treatment',
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;