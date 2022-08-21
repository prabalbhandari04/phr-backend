const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;




// use function create date to add existing disease
const existing  = new Schema({
    sleepapnea : {
        type : Boolean,
        default : false
    },
    cancer : {
        type : Boolean,
        default : false
    },
    arthritis : {
        type : Boolean,
        default : false
    },
    glaucoma : {
        type : Boolean,
        default : false
    },
    heartdisease : {
        type : Boolean,
        default : false
    },
    diabetes : {
        type: Boolean,
        default: false
    },
    highbloodpressure : {
        type: Boolean,
        default: false
    },
    thyroid : {
        type: Boolean,
        default: false
    }
    ,
    asthma : {
        type: Boolean,
        default: false
    }
    ,
    highbloodpressure : {
        type: Boolean,
        default: false
    },
    hypertension : {
        type: Boolean,
        default: false
    }
    ,
    aids_hiv : {
        type: Boolean,
        default: false
    }
})

const existingSurgery = new Schema({
    heart : {
        type : Boolean,
        default : false
    },
    lung : {
        type : Boolean,
        default : false
    },
    kidney : {
        type : Boolean,
        default : false
    },
    liver : {
        type : Boolean,
        default : false
    },
    bone : {
        type : Boolean,
        default : false
    },
    eye : {
        type : Boolean,
        default : false
    },
    skin : {
        type : Boolean,
        default : false
    },
    other : {
        type : Boolean,
        default : false
    }
})


const dependency = new Schema({
    name : {
        type: String,
    },
    contact_no : {
        type: String,
    },
    age: {
        type: String,
    },
    dob : {
        type: Date,
    },
    gender: {
            type: String,
            enum: ['Male', 'Female', 'Others'],
            // required : [true, "Please enter your gender!"]
    },
    blood: {
        type: String,
        enum: ['A+', 'A-', 'B+','B-','AB+','AB-','O+','O-'],
        // required : [true, "Please enter your gender!"]
    },
    height:{
        type:String
    },
    weight:{
        type:String
    },
    relation:{
        type:String
    }
});


const userSchema = new mongoose.Schema({
    userId : {
        type: String
    },
    dependacyId : {
        type: String
    },
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    contact_no: {
        type: String,
    },
    dob:{
        type:Date,
        // required: [true, "Please enter your date of birth!"]
    },
    gender: {
            type: String,
            enum: ['Male', 'Female', 'Others'],
            // required : [true, "Please enter your gender!"]
    },
    blood: {
        type: String,
        enum: ['A+', 'A-', 'B+','B-','AB+','AB-','O+','O-'],
        // required : [true, "Please enter your gender!"]
    },
    height:{
        type:String
    },
    weight:{
        type:String
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "user" // 0 = user, 1 = doctor, 2=clinic, 3=admin , user ,admin ,doctor, clinic
    },
    dependency : [dependency],
    existing : [existing],
    existingSurgery : [existingSurgery],
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)

    
const Users = mongoose.model('Users', userSchema);
const PatientDependency = mongoose.model('PatientDependency', dependency);
const ExistingDisease = mongoose.model('existingDisease', existing);
const ExistingSurgery = mongoose.model('existingSurgery', existingSurgery);
module.exports = {
    Users,
    PatientDependency,
    ExistingDisease,
    ExistingSurgery
};

