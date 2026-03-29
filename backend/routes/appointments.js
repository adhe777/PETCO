const express = require('express');
const router = express.Router();
const { getMyAppointments, updateAppointmentStatus, bookAppointment } = require('../controllers/appointmentController');
const { auth } = require('../middleware/authMiddleware');

// @route   GET /api/appointments/my
router.get('/my', auth, getMyAppointments);

// @route   POST /api/appointments/book
router.post('/book', auth, bookAppointment);

// @route   PATCH /api/appointments/update/:id
router.patch('/update/:id', auth, updateAppointmentStatus);

module.exports = router;
