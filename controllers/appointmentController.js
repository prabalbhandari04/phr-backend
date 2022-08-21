const router = require("express").Router();
const doctors = require("../models/doctorModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appointmentImport = require("../models/appointmentModel");
const { Doctor, Slot,Shift, DateSchedule } = doctors;
const { Appointment, Feedback } = appointmentImport;
const users = require("../models/userModel");
const pdf = require('../utils/sendPdf');
const { createBookingPdf } = require("../utils/sendPdf");

// function to create default slot and booking status
function createDate(date) {
    return new DateSchedule({
        date: date,
        // create new shift with id and array it to slots
        shift : [
            new Shift({
                shift: "Morning",
                doctorOut: false,
                slot : [
                    new Slot({
                        time : "09:00-09:15 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:15-09:30 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:30-09:45 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:45-10:00 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:00-10:15 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:15-10:30 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:30-10:45 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:45-11:00 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "11:00-11:15 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "11:15-11:30 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "11:30-11:45 AM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "11:45-12:00 PM",
                        isBooked : false
                    })
                ]
            }),
            new Shift({
                shift: "Afternoon",
                slot : [
                    new Slot({
                        time : "12:00-12:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "12:15-12:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "12:30-12:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "12:45-01:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "01:00-01:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "01:15-01:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "01:30-01:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "01:45-02:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "02:00-02:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "02:15-02:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "02:30-02:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "02:45-03:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "03:00-03:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "03:15-03:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "03:30-03:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "03:45-04:00 PM",
                        isBooked : false
                    })


        ]
            }),
            new Shift({
                shift: "Evening",
                slot : [
                    new Slot({
                        time : "04:00-04:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "04:15-04:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "04:30-04:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "04:45-05:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "05:00-05:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "05:15-05:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "05:30-05:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "05:45-06:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "06:00-06:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "06:15-06:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "06:30-06:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "06:45-07:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "07:00-07:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "07:15-07:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "07:30-07:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "07:45-08:00 PM",
                        isBooked : false
                    })
                ]
            }),
            new Shift({
                shift: "Night",
                slot : [
                    new Slot({
                        time : "08:00-08:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "08:15-08:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "08:30-08:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "08:45-09:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:00-09:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:15-09:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:30-09:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "09:45-10:00 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:00-10:15 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:15-10:30 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:30-10:45 PM",
                        isBooked : false
                    }),
                    new Slot({
                        time : "10:45-11:00 PM",
                        isBooked : false
                    })
                ]
            })
        ]

    });
}

const appointmentController = {
    
    getSlot : async (req, res) => {
    try {
		const doctorId = req.params.id // Doctor's id
		const date = req.body.date; // Date to book
		const doctor = await Doctor.findOne({ _id: doctorId });

		// Doctor not found
		if (doctor === null) {
			console.log("Doctor not found in the database!");
			return res.status(201).json({
				message: "Doctor not found in the database!",
			});
		}

		// Doctor found
		// Find the date
		let count = 0;
		for (const i of doctor.dates) {
			if (i.date === date) {
				return res.status(200).json(i);
			}
			count++;
		}

		const oldLength = count;

		// Add new slots if date not found in the db
		const dateSchedule = createDate(date);
		const updatedDoctor = await Doctor.findOneAndUpdate(
			{ _id: doctor._id },
			{ $push: { dates: dateSchedule } },
			{ new: true }
		);
        console.log(updatedDoctor)
		if (updatedDoctor) {
			return res.status(200).json(updatedDoctor.dates[oldLength]);
		} else {
			const err = { err: "an error occurred!" };
			throw err;
		}
	} catch (err) {
		console.log(err);
		return res.status(400).json({
			message: err,
		});
	    }
    },
    bookAppointment : async (req, res) => {
    const patientId = req.body.patientId; // Patient's  id
	const doctorId = req.body.doctorId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
	const slotId = req.body.slotId; // Id of that particular slot
	const dateId = req.body.dateId; // Id of that particular date
    const shiftId = req.body.shiftId; // Id of that particular shift
    const patientReasonForVisit = req.body.patientReasonForVisit;

	Doctor.findOne({ _id: doctorId }).then((doctor) => {
        users.findOne({ _id: patientId }).then((user) => {
		const date = doctor.dates.id(dateId);
        const shift = date.shift.id(shiftId);
        const slot = shift.slot.id(slotId);
        slot.isBooked = true;
        doctor.save().then(() => {
            // Create an entry in the appointment database
            const newAppointment = new Appointment({
                doctorId,
                doctorName: doctor.name,
                doctorEmail: doctor.email,
                doctorContact_no:doctor.contact_no,
                doctorNMC : doctor.NMC_no,
                doctorExperience :doctor.experience,
                doctorQualification : doctor.qualification,
                doctorSpecialization : doctor.specialization,
                doctorFeesPerSession : doctor.feesPerSession,
                patientId,
                patientName: user.name,
                patientContact_no : user.contact_no,
                patientEmail : user.email,
                patientDob : user.dob,
                patientGender : user.gender,
                patientBlood : user.blood,
                patientHeight : user.height,
                patientWeight : user.weight,
                patientReasonForVisit,
                date: date.date,
                Shift: shift.shift,
                slotTime: slot.time,
                feedback: new Feedback()
            });

            console.log(newAppointment);

            newAppointment
                .save()
                .then((appointment) => {
                    return res.status(200).json(appointment);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json(err);
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                message: `An error occurred : ${err}`,
            });
        });
	});
});
    },
    doctorAllAppointments : async (req, res) => {
        try {
            const doctorId = req.body.doctorId;
            const appointments = await Appointment.find({
                doctorId: doctorId,
            });
            // res.status(200).json(appointments);
            const sortedAppointments = appointments.sort((a, b) => {
                return (
                    Date.parse(b.date + "T" + b.slotTime) -
                    Date.parse(a.date + "T" + a.slotTime)
                );
            });
    
            res.status(200).json(sortedAppointments);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    getAppointmentId :async (req, res) => {
        try {
            const appointmentId = req.params.id;
            const appointment = await Appointment.findOne({
                _id: appointmentId,
            });
    
            res.status(200).json(appointment);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    doctorTodayAppointments : async (req, res) => {
        try {
            const date = new Date()
            let currDate = date.getFullYear().toString()
            const month = date.getMonth() + 1
            const day = date.getDate()
            console.log(date)
            currDate += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
            currDate += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
    
            const doctorId = req.body.doctorId;
    
            const appointments = await Appointment.find({ doctorId: doctorId, date: currDate });
    
            const sortedAppointments = appointments.sort((a, b) => {
                return (
                    Date.parse(a.date + "T" + a.slotTime) - Date.parse(b.date + "T" + b.slotTime)
                );
            });
            console.log(sortedAppointments)
            res.status(200).json(sortedAppointments);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    doctorPreviousAppointment : async (req, res) => {
        try {
            const doctorId = req.body.doctorId;
    
            const appointments = await Appointment.find({ doctorId: doctorId });
    
            // Get current dateTime
            const date = new Date()
            let currDateTime = date.getFullYear().toString()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hour = date.getHours()
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            console.log(date)
            currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
            currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
            currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
            currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
            currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()
    
            const filteredAppointments = appointments.filter((appointment) => {
                return Date.parse(currDateTime) >= Date.parse(appointment.date + 'T' + appointment.slotTime)
            })
    
            const sortedAppointments = filteredAppointments.sort((a, b) => {
                return Date.parse(b.date + 'T' + b.slotTime) - Date.parse(a.date + 'T' + a.slotTime)
            })
            console.log(sortedAppointments)
            res.status(200).json(sortedAppointments);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    patientAllAppointments : async (req, res) => {
        try {
            const patientId = req.body.patientId;
            const appointments = await Appointment.find({
                patientId: patientId,
            });
            // res.status(200).json(appointments);
            const sortedAppointments = appointments.sort((a, b) => {
                return (
                    Date.parse(b.date + "T" + b.slotTime) -
                    Date.parse(a.date + "T" + a.slotTime)
                );
            });
    
            res.status(200).json(sortedAppointments);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    patientTodayAppointments : async (req, res) => {
        try {
            const date = new Date()
            let currDate = date.getFullYear().toString()
            const month = date.getMonth() + 1
            const day = date.getDate()
            console.log(date)
            currDate += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
            currDate += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
    
            const patientId = req.body.patientId;
    
            const appointments = await Appointment.find({ patientId: patientId, date: currDate });
    
            const sortedAppointments = appointments.sort((a, b) => {
                return (
                    Date.parse(a.date + "T" + a.slotTime) - Date.parse(b.date + "T" + b.slotTime)
                );
            });
            console.log(sortedAppointments)
            res.status(200).json(sortedAppointments);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    patientPreviousAppointment : async (req, res) => {
        try {
            const patientId = req.body.patientId;
    
            const appointments = await Appointment.find({ patientId: patientId });
    
            // Get current dateTime
            const date = new Date()
            let currDateTime = date.getFullYear().toString()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hour = date.getHours()
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            console.log(date)
            currDateTime += month < 10 ? ('-0' + month.toString()) : '-' + month.toString()
            currDateTime += day < 10 ? ('-0' + day.toString()) : '-' + day.toString()
            currDateTime += hour < 10 ? ('T0' + hour.toString()) : 'T' + hour.toString()
            currDateTime += minutes < 10 ? (':0' + minutes.toString()) : ':' + minutes.toString()
            currDateTime += seconds < 10 ? (':0' + seconds.toString()) : ':' + seconds.toString()
    
            const filteredAppointments = appointments.filter((appointment) => {
                return Date.parse(currDateTime) >= Date.parse(appointment.date + 'T' + appointment.slotTime)
            })
    
            const sortedAppointments = filteredAppointments.sort((a, b) => {
                return Date.parse(b.date + 'T' + b.slotTime) - Date.parse(a.date + 'T' + a.slotTime)
            })
            console.log(sortedAppointments)
            res.status(200).json(sortedAppointments);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    doneStatus : async (req, res) => {
        try {
            const appointmentId = req.body.appointmentId;
            const appointment = await Appointment.findById(appointmentId);
            appointment.status = "Done";
            await appointment.save();
            res.status(200).json(appointment);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    cancelStatus : async (req, res) => {
        try {
            const appointmentId = req.body.appointmentId;
            const appointment = await Appointment.findById(appointmentId);
            appointment.status = "Cancelled";
            await appointment.save();
            res.status(200).json(appointment);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    deleteAppointment : async (req, res) => {
        try {
            const appointmentId = req.body.appointmentId;
            const appointment = await Appointment.findByIdAndDelete(appointmentId);
            res.status(200).json(appointment);
        }
        catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },
    feedback : async (req, res) => {
        const appointmentId = req.body.appointmentId;
        const stars = req.body.stars;
        const awards = req.body.awards;
        const review = req.body.review;

        Appointment.findOne({ _id : appointmentId }).then((appointment) => {
            if(appointment) {
                appointment.feedback.stars = stars;
                appointment.feedback.awards = awards;
                appointment.feedback.review = review;
                appointment.feedback.given = true;

                appointment.save().then(() => {
                    res.status(200).json({message : `Feedback updated successfully!`});
                }).catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    pdf : async (req, res, next) => {

        const appointmentId = req.params.id;
            const appointment = await Appointment.findOne({
                _id: appointmentId,
            });
    
            const bookingtest= JSON.stringify(appointment);
            const booking = JSON.parse(bookingtest);
            console.log(booking);
    
        const details = booking.patientName + "_" + booking.date + "_" + booking.slotTime;
        createBookingPdf(booking,details+"_confirmation.pdf");
        res.send("Appointment with "+booking.doctorName+" created successfully for the date "+booking.date+" on "+booking.slotTime);
    },

    doctorOutShift : async (req, res) => {
        
        const doctorId = req.body.doctorId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
	    const slotId = req.body.slotId; // Id of that particular slot
        const dateId = req.body.dateId; // Id of that particular date
        const shiftId = req.body.shiftId; // Id of that particular shift
        Doctor.findOne({ _id : doctorId }).then((doctor) => {
            const date = doctor.dates.id(dateId);
            const shift = date.shift.id(shiftId);
            shift.doctorOut = true;
            doctor.save().then(() => {
                res.status(200).json({message : `Shift updated successfully!`});
            }).catch(err => {
                console.log(err);~
                res.status(400).json(err);
            }
            )
        }).catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    doctorHoliday : async (req, res) => {
        
        const doctorId = req.body.doctorId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
	const dateId = req.body.dateId; // Id of that particular date
    Doctor.findOne({ _id : doctorId }).then((doctor) => {
        const date = doctor.dates.id(dateId);
        date.holiday = true;
        doctor.save().then(() => {
            res.status(200).json({message : `Holiday updated successfully!`});
        }).catch(err => {
            console.log(err);~
            res.status(400).json(err);
        }
        )
    }).catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
    },
} 





module.exports = appointmentController