const Appointment = require('../models/Appointment');

// @route   GET /api/appointments/my
// @desc    Get all appointments for the logged-in user
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        let appointments;
        const isDoctor = req.user.role === 'Veterinarian' || req.user.role === 'doctor';

        if (isDoctor) {
            appointments = await Appointment.find({ doctorId: req.user.id })
                .populate('userId', 'name email')
                .sort({ date: -1, createdAt: -1 });
        } else {
            appointments = await Appointment.find({ userId: req.user.id })
                .populate('doctorId', 'name specialization')
                .populate('recommendedProducts')
                .sort({ date: -1, createdAt: -1 });
        }

        res.status(200).json(appointments);
    } catch (err) {
        console.error('Error fetching user appointments:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status/details (Doctor only)
// @access  Private
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status, diagnosis, prescription, notes, recommendedProducts } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Verify that the logged-in doctor is the one assigned to this appointment
        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this appointment' });
        }

        if (status) appointment.status = status;
        if (diagnosis) appointment.diagnosis = diagnosis;
        if (prescription) appointment.prescription = prescription;
        if (notes) appointment.notes = notes;
        if (recommendedProducts !== undefined) appointment.recommendedProducts = recommendedProducts;

        await appointment.save();
        res.status(200).json(appointment);
    } catch (err) {
        console.error('Error updating appointment:', err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST /api/appointments/book
// @desc    Book a new appointment
// @access  Private
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, petName, reason, paymentMethod } = req.body;

        if (!doctorId || !date || !time) {
            return res.status(400).json({ message: 'Doctor, date, and time are required' });
        }

        // Check for existing appointment at the same time for this doctor
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date,
            time,
            status: { $ne: 'Cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'This slot is already booked. Please select another time.' });
        }

        const newAppointment = new Appointment({
            userId: req.user.id,
            doctorId,
            date,
            time,
            petName,
            reason,
            paymentMethod: paymentMethod || 'Cash',
            status: 'Pending'
        });

        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        console.error('Error booking appointment:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getMyAppointments,
    updateAppointmentStatus,
    bookAppointment
};
