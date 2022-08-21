const doctors = require('../models/doctorModel')
const { Doctor } = doctors;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const qrcode = require("qrcode");
const {google} = require('googleapis')
const {OAuth2} = google.auth
const fetch = require('node-fetch')

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const {CLIENT_URL} = process.env

const doctorCtrl = {
    register: async (req, res) => {
        try {
            const {name,email,password,NMC_no,contact_no,specialization,qualification,experience,feesPerSession} = req.body
            
            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid emails."})

            const doctor = await Doctor.findOne({email})
            if(doctor) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

            const passwordHash = await bcrypt.hash(password, 12)

            const newDoctor = {
                name, email, password: passwordHash,NMC_no,contact_no,specialization,qualification,experience,feesPerSession
            }

            // activate direct without activateion email for testing
            const newDoctors = new Doctor({
                name, email, password: passwordHash,NMC_no,contact_no,specialization,qualification,experience,feesPerSession
            })
            await newDoctors.save()
            res.json({msg: "Account has been activated!"})

            const activation_token = createActivationToken(newDoctor)

            const url = `${CLIENT_URL}/doctor/activate/${activation_token}`
            sendMail(email, url, "Verify your email address")


            res.json({msg: "Register Success! Please activate your email to start."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const doctor = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name,email,password,NMC_no,contact_no,specialization,qualification,experience,feesPerSession} = doctor

            const check = await Doctor.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newDoctor = new Doctor({
                name,email,password,NMC_no,contact_no,specialization,qualification,experience,feesPerSession
            })

            await newDoctor.save()
            console.log(doctor)
            console.log(newDoctor)
            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const doctor = await Doctor.findOne({email})
            if(!doctor) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, doctor.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: doctor._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/doctor/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
            
            res.json({msg: "Login success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, doctor) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: doctor.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const doctor = await Doctor.findOne({email})
            if(!doctor) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: doctor._id})
            const url = `${CLIENT_URL}/doctor/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            console.log(password)
            const passwordHash = await bcrypt.hash(password, 12)

            await Doctor.findOneAndUpdate({_id: req.doctor.id}, {
                password: passwordHash
            })

            res.json({msg: "Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getDoctorInfo: async (req, res) => {
        try {
            const doctor = await Doctor.findById(req.params.id).select('-password')
            res.json(doctor)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getDoctorAllInfo: async (req, res) => {
        try {
            const doctors = await Doctor.find().select('-password')

            res.json(doctors)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/doctor/refresh_token'})
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateDoctor: async (req, res) => {
        try {
            const {name, avatar} = req.body
            await Doctor.findOneAndUpdate({_id: req.doctor.id}, {
                name, avatar
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    deleteDoctor: async (req, res) => {
        try {
            await Doctor.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateDoctorsRole: async (req, res) => {
        try {
            const {role} = req.body

            await Doctor.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    googleLogin: async (req, res) => {
        try {
            const {tokenId} = req.body

            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
            
            const {email_verified, email, name, picture} = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const doctor = await Doctor.findOne({email})

            if(doctor){
                const isMatch = await bcrypt.compare(password, doctor.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: doctor._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/doctor/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newDoctor = new Doctor({
                    name, email, password: passwordHash, avatar: picture
                })

                await newDoctor.save()
                
                const refresh_token = createRefreshToken({id: newDoctor._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/doctor/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const {accessToken, userID} = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            
            const data = await fetch(URL).then(res => res.json()).then(res => {return res})

            const {email, name, picture} = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const doctor = await Doctor.findOne({email})

            if(doctor){
                const isMatch = await bcrypt.compare(password, doctor.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: doctor._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/doctor/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newDoctor = new Doctor({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newDoctor.save()
                
                const refresh_token = createRefreshToken({id: newDoctor._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/doctor/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    doctorShare : async (req, res) => {
        try {
            const doctorId = req.body.doctorId; 
            const doctor = await Doctor.findOne({ _id : doctorId }).select('-password -role -lastLogin -updatedAt -createdAt -__v  -_id -dates')
            const jsonTransform = JSON.stringify(doctor)
            console.log(jsonTransform)
            const input_text = jsonTransform;
            qrcode.toDataURL(input_text, (err, src) => {
                if (err) res.send("Something went wrong!!");
                res.render("scan", {
                qr_code: src,
                });
            });
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

}





function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = doctorCtrl