const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const slotSchema = new Schema({
            time : {
                type: String,
            },
            isBooked : {
                type: Boolean,
                default: false
            }
})

const shiftSchema = new Schema({
    shift : {
        type: String,
    },
    doctorOut : {
        type: Boolean,
        default: false
    },
    slot : [slotSchema]

})

const dateSchedule = new Schema({
    date : {
        type: String
    },
    holiday : {
        type: Boolean,
        default: false
    },
    shift : [shiftSchema]
})


// gender and dob
const doctorSchema = new Schema({
    name: {
        type: String
    },
    NMC_no : {
        type:Number
    },
    password: {
        type: String,
    },
    email : {
        type: String
    },
    contact_no: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // required : [true, "Please enter your gender!"]
    },
    dob:{
        type:Date
    },
    experience: {
        type: String
    },
    qualification: {
        type: String
    },
    specialization: {
        type: String
    },
    feesPerSession: {
        type: String
    },
    dates : [dateSchedule],
    role: {
        type: Number,
        default: 2 // 0 = user, 1 = admin , 2 = doctor
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    status : {
        type :String,
        default : 'online'
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    }
}, {
    timestamps: true
})



// #works create slots and date but cant create doctor 
const Doctor = mongoose.model('Doctor', doctorSchema);
const Slot = mongoose.model('Slot', slotSchema);
const DateSchedule = mongoose.model('DateSchedule', dateSchedule);
const Shift = mongoose.model('Shift', shiftSchema);
module.exports = {
    Doctor,
    Slot,
    DateSchedule,
    Shift
};
