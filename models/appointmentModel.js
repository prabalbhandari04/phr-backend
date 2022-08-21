const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedback = new Schema({
    given : {
        type : Boolean,
        default : false
    },
    stars : {
        type : Number,
        default : 0,
        min : 0,
        max : 5
    },
    awards: {
        type: String,
        enum: ['Expert', 'Helpful', 'kind', 'Friendly', 'Unfriendly', 'Unhelpful','Unprofessional'],
        // required : [true, "Please enter your gender!"]
    },
    review : {
        type : String,
        default : ""
    }
})

const appointmentSchema = new Schema({
    doctorId : {
        type: String
    },
    dateId : {
        type: String
    },
    slotId : {
        type: String
    },
    patientId : {
        type: String
    },
    date : {
        type: String
    },
    bookedDate: {
        type: Date,
        default: Date.now
    },
    slotTime : {
        type: String
    },
    doctorName : {
        type : String
    },
    doctorEmail : {
        type : String
    },
    doctorContact_no:{
        type : String
    },
    doctorNMC_no : {
        type:Number
    },
    doctorExperience:{
        type : String
    },
    doctorQualification: {
        type : String
    },
    doctorSpecialization: {
        type: String
    },
    doctorFeesPerSession: {
        type: String
    },
    patientName : {
        type : String
    },
    patientContact_no:{
        type : String
    },
    patientEmail : {
        type : String
    },
    patientDob : {
        type : Date
    },
    patientGender:{
        type:String
    },
    patientBlood: {
        type: String
    },
    patientHeight:{
        type: String
    },
    patientWeight:{
        type: String
    },
    patientReasonForVisit: {
        type: String
    },
    status: {
        type: String,
        default:"Upcoming",
        enum: ['Upcoming', 'Done', 'Past','Cancelled'],
        // required : [true, "Please enter your gender!"]
    },    
    feedback : feedback
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
const Feedback = mongoose.model('Feedback', feedback);

module.exports = { Appointment,  Feedback };