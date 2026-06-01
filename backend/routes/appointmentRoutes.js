const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  deleteAppointment,
  getAdminAppointments,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/available', protect, getAvailableSlots);
router.post('/', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.delete('/:id', protect, deleteAppointment);
router.get('/admin', protect, adminOnly, getAdminAppointments);

module.exports = router;