const Appointment = require('../models/Appointment');

const procedureDurations = {
  'Basic Check-up': 20,
  'Cavity Filling': 30,
  'Deep Cleaning': 40,
  'Tooth Extraction': 45,
  'Root Canal Treatment': 60,
};

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const getAvailableSlots = async (req, res) => {
  try {
    const { date, procedure, hour } = req.query;

    if (!date || !procedure) {
      return res.status(400).json({ message: 'Date and procedure are required' });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({
        message: 'Appointments are not available on weekends. Please select a weekday (Monday-Friday).',
      });
    }

    const duration = procedureDurations[procedure];
    if (!duration) {
      return res.status(400).json({ message: 'Invalid procedure type' });
    }

    const workStart = 9 * 60;
    const workEnd = 17 * 60;

    if (hour !== undefined && hour !== '') {
      const hourNum = parseInt(hour);
      const hourStart = hourNum * 60;
      const hourEnd = hourStart + 60;

      if (hourStart < workStart || hourStart >= workEnd) {
        return res.status(400).json({ message: 'Selected hour is outside working hours (09:00-17:00)' });
      }

      const allSlots = [];
      for (let start = workStart; start + duration <= workEnd; start += 10) {
        if (start >= hourStart && start < hourEnd) {
          allSlots.push(minutesToTime(start));
        }
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const existingApps = await Appointment.find({
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      const availableSlots = allSlots.filter((slot) => {
        const slotStart = timeToMinutes(slot);
        const slotEnd = slotStart + duration;
        const conflict = existingApps.some((app) => {
          const appStart = timeToMinutes(app.startTime);
          const appEnd = appStart + app.duration;
          return slotStart < appEnd && slotEnd > appStart;
        });
        return !conflict;
      });

      res.json({ availableSlots });
    } else {
      const availableHours = [];
      for (let h = 9; h < 17; h++) {
        const hourStart = h * 60;
        let possible = false;
        for (let start = hourStart; start < hourStart + 60 && start + duration <= workEnd; start += 10) {
          possible = true;
          break;
        }
        if (possible) {
          availableHours.push(h.toString().padStart(2, '0') + ':00');
        }
      }
      res.json({ availableHours });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { date, startTime, procedure } = req.body;

    if (!date || !startTime || !procedure) {
      return res.status(400).json({ message: 'Please provide date, startTime, and procedure' });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ message: 'Cannot book appointments on weekends. Please select a weekday.' });
    }

    const duration = procedureDurations[procedure];
    if (!duration) {
      return res.status(400).json({ message: 'Invalid procedure' });
    }

    const slotStart = timeToMinutes(startTime);
    const slotEnd = slotStart + duration;
    const workStart = 9 * 60;
    const workEnd = 17 * 60;

    if (slotStart < workStart || slotEnd > workEnd) {
      return res.status(400).json({ message: 'Appointment outside working hours' });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const conflict = existing.some((app) => {
      const appStart = timeToMinutes(app.startTime);
      const appEnd = appStart + app.duration;
      return slotStart < appEnd && slotEnd > appStart;
    });

    if (conflict) {
      return res.status(409).json({ message: 'Time slot is no longer available' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      date,
      startTime,
      duration,
      procedure,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .sort({ date: -1, startTime: 1 })
      .populate('patient', 'name email phone');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminAppointments = async (req, res) => {
  try {
    const { date } = req.query;

    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .sort({ date: 1, startTime: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  deleteAppointment,
  getAdminAppointments,
};