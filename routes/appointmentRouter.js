const router = require('express').Router()
const doctorCtrl = require('../controllers/doctorController')
const appointmentCtrl = require('../controllers/appointmentController')
    
	

// To get all the doctors
// **ONLY FOR TESTING**
router.route("/").get((req, res) => {
	Doctor.find()
		.then((doctors) => {
			res.json(doctors);
		})
		.catch((err) => {
			res.status(400).json(`Error : ${err}`);
		});
});



router.get('/get-slots/:id', appointmentCtrl.getSlot)
router.post('/book-appointment',appointmentCtrl.bookAppointment)
router.post('/doc-all-appointments', appointmentCtrl.doctorAllAppointments)
router.get('/doc-get-appointments/:id', appointmentCtrl.getAppointmentId)
router.post('/doc-today-appointments', appointmentCtrl.doctorTodayAppointments)
router.post('/doc-previous-appointments', appointmentCtrl.doctorPreviousAppointment)
router.post('/patient-all-appointments', appointmentCtrl.patientAllAppointments)
router.post('/patient-today-appointments', appointmentCtrl.patientTodayAppointments)
router.post('/patient-previous-appointments', appointmentCtrl.patientPreviousAppointment)
router.patch('/update-appointment-done', appointmentCtrl.doneStatus)
router.patch('/update-appointment-cancel', appointmentCtrl.cancelStatus)
router.delete('/delete-appointment/:id', appointmentCtrl.deleteAppointment)
router.put('/feedback', appointmentCtrl.feedback)
router.get('/pdf/:id', appointmentCtrl.pdf)
router.post('/doctor-out-shift', appointmentCtrl.doctorOutShift)
router.post('/doctor-holiday', appointmentCtrl.doctorHoliday)
module.exports = router;
