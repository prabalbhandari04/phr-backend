const Users = require('../models/userModel')
const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.find({role: 3})
        if(user.role !== 3) 
            return res.status(500).json({msg: "Admin resources access denied."})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin