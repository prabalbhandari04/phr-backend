const {Users,PatientDependency,ExistingDisease,ExistingSurgery} = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const qrcode = require("qrcode");
const {google} = require('googleapis')
const {OAuth2} = google.auth
const fetch = require('node-fetch')
const { json } = require('express')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.ObjectId
// mailing env key
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

// client url from dot env
const {CLIENT_URL} = process.env


// user controller
const userCtrl = {

    // register user controller using name, email, password, dob,gender, blood , height, weight
    register: async (req, res) => {
        try {
            const {name, email, password,dob,gender,blood,height,weight} = req.body

            // validation for name email and password            
            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})
            
            // validation for email
            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid emails."})

            // redundancy check for email
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})

            // password length check
            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

            // password hash
            const passwordHash = await bcrypt.hash(password, 12)

            // create user
            const newUser = {
                name, email, password: passwordHash,dob,gender,blood,height,weight,dependency: new PatientDependency(),existing : new ExistingDisease(), existingSurgery : new ExistingSurgery()
            }
        
            // create activation token 
            const activation_token = createActivationToken(newUser)

            // send activation token via email
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, "Verify your email address")

            // email send waiting for activation
            res.json({msg: "Register Success! Please activate your email to start."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    // activate user controller using activation token
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
            
            const {name, email, password,dob,gender,blood,height,weight} = user


            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name, email, password,dob,gender,blood,height,weight,dependency: new PatientDependency(),existing : new ExistingDisease(), existingSurgery : new ExistingSurgery()
            })

            await newUser.save()
            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // login user controller using email and password
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})

            // email not found
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            // password incorrect
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            // create access token
            const refresh_token = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })


            res.json({msg: "Login success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // refresh token controller
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // forget password controller
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await Users.findOne({email})

            // email not found
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            // create activation token
            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            // send activation token via email
            sendMail(email, url, "Reset your password")
            res.json({msg: "Re-send the password, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // reset password controller
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body
            
            // password length check
            const passwordHash = await bcrypt.hash(password, 12)
            
            // update password
            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            res.json({msg: "Password successfully changed!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    // get user info controller
    getUserInfo: async (req, res) => {
        try {
            // get user info
            const user = await Users.findById(req.user.id).select('-password')

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    // update user info controller
    getUsersAllInfo: async (req, res) => {
        try {
            const users = await Users.find().select('-password')
            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    // update user info controller
    test: async (req, res) => {
        const user  = await Users.findById(req.params.id)
        res.json(user._id)
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {name, avatar} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                name, avatar
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const {role} = req.body

            await Users.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
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

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
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

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    addDependancy: async (req, res) => {
        // const userId = req.user.id;
        const userId = req.body.userId;
        const name  = req.body.name;
        const contact_no = req.body.contact_no;
        const age = req.body.age;
        const dob = req.body.dob;
        const gender = req.body.gender;
        const blood = req.body.blood;
        const height = req.body.height;
        const weight = req.body.weight;
        const relation = req.body.relation
        const all = {name,contact_no,age,dob,gender,blood,height,weight,relation}
        Users.findOneAndUpdate(
            { _id : userId }, 
            { $push: { dependancy: all  } },
           function (error, success) {
                 if (error) {
                    return res.status(500).json({msg: err.message})
                 } else {
                    return res.status(200).json("Family member profile added successfully");
                 }
             });
    },

    viewDependancy : async (req, res) => {
        try{
        const userId = req.body.userId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
        const user = await Users.findOne({ _id : userId })
        const dependancy = user.dependancy
            res.json(dependancy)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateDependacy : async (req, res) => {
        
            const userId = req.body.userId;
            const name  = req.body.name;
            const contact_no = req.body.contact_no;
            const age = req.body.age;
            const dob = req.body.dob;
            const gender = req.body.gender;
            const blood = req.body.blood;
            const height = req.body.height;
            const weight = req.body.weight;
            const relation = req.body.relation;
            const all = {name,contact_no,age,dob,gender,blood,height,weight,relation}
            const user = await Users.findOne({ _id : userId })
            const dependancyId = req.body.dependancyId
            

               Users.updateMany(
                { _id : userId , "dependancy._id" : dependancyId },
                { $set: { "dependancy.$": all } },
                function (error, success) {
                    if (error) {
                        return res.status(500).json({msg: err.message})
                    } else {
                        return res.status(200).json("Family member profile updated successfully");
                    }
                }
               )
            
    },

    deleteDependancy : async (req, res) => {
        const userId = req.body.userId; 
        const dependancyId = req.body.dependacyId
       

        Users.updateOne({
            _id : userId
          }, {
            $pullAll: {
              dependancy: dependancyId,
            },
          });
          res.json("Dependancy deleted successfully")
    },
    
    addExisting: async (req, res) => {
        const userId = req.body.userId;
        const sleepapnea = req.body.sleepapnea;
        const cancer = req.body.cancer;
        const diabetes = req.body.diabetes;
        const athritis = req.body.athritis;
        const glaucoma = req.body.glaucoma;
        const heartdisease = req.body.heartdisease;
        const hypertension = req.body.hypertension;
        const asthma = req.body.asthma;
        const highbloodpressure = req.body.highbloodpressure;
        const aids_hiv = req.body.aids_hiv;
        const thyroid = req.body.thyroid;
        const all = {sleepapnea,cancer,diabetes,athritis,glaucoma,heartdisease,hypertension,asthma,highbloodpressure,aids_hiv,thyroid}
        Users.findOneAndUpdate(
            { _id : userId }, 
            { $set: { existing: all  } },
           function (error, success) {
                 if (error) {
                    return res.status(500).json({msg: err.message})
                 } else {
                    return res.status(200).json("Existing Disease added successfully");
                 }
             });
    },

    viewExisting : async (req, res) => {
        try{
        const userId = req.body.userId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
        const user = await Users.findOne({ _id : userId })
        const existing = user.existing
            res.json(existing)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },


    addExistingSurgery: async (req, res) => {
        const userId = req.body.userId;
        const heart = req.body.heart;
        const all = {heart}
        Users.findOneAndUpdate(
            { _id : userId }, 
            { $set: { existingSurgery: all  } },
           function (error, success) {
                 if (error) {
                    return res.status(500).json({msg: err.message})
                 } else {
                    return res.status(200).json("Existing Disease added successfully");
                 }
             });
    },

    viewExistingSurgery : async (req, res) => {
        try{
        const userId = req.body.userId; // Doctor's id 606460d2e0dd28cc76d9b0f3 
        const user = await Users.findOne({ _id : userId })
        const existingSurgery = user.existingSurgery
            res.json(existingSurgery)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    share : async (req, res) => {
            try {
                const userId = req.body.userId; 
                const user = await Users.findOne({ _id : userId }).select('-password -role -lastLogin -updatedAt -createdAt -__v -dependancy -_id')
                const jsonTransform = JSON.stringify(user)
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
};





function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '15m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '45m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

module.exports = userCtrl