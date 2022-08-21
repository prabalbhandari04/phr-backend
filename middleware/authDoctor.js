const jwt = require('jsonwebtoken')


const authDoctor = (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "Invalid Authentication."})

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, doctor) => {
            if(err) return res.status(400).json({msg: "Invalid Authentication."})

            req.doctor = doctor
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authDoctor