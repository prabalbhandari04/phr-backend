const router = require('express').Router()
const userCtrl = require('../controllers/userController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

// register route user 
router.post('/register', userCtrl.register)

// user activation route
router.post('/activation', userCtrl.activateEmail)

// user login route
router.post('/login', userCtrl.login)

// user refresh token
router.post('/refresh_token', userCtrl.getAccessToken)

// user forgot password activate route
router.post('/forgot', userCtrl.forgotPassword)

// user forgot password reset route
router.post('/reset', auth, userCtrl.resetPassword)

// user info get route
router.get('/info',auth, userCtrl.getUserInfo)

// user all info 
router.get('/all', authAdmin, userCtrl.getUsersAllInfo)

router.get("/test/:id", userCtrl.test)

router.get('/logout', userCtrl.logout)
router.patch('/update', auth, userCtrl.updateUser)
router.patch('/update_role/:id', auth, authAdmin, userCtrl.updateUsersRole)
router.delete('/delete/:id', auth, authAdmin, userCtrl.deleteUser)
router.post('/google_login', userCtrl.googleLogin)
router.post('/facebook_login', userCtrl.facebookLogin)
router.post('/add-dependancy', userCtrl.addDependancy)
router.get('/get-dependancy', userCtrl.viewDependancy)
router.patch('/update-dependancy', userCtrl.updateDependacy)
router.delete('/delete-dependancy', userCtrl.deleteDependancy)
router.post('/add-existing', userCtrl.addExisting)
router.post('/get-existing', userCtrl.viewExisting)
router.post('/add-existing-surgery', userCtrl.addExistingSurgery)
router.post('/get-existing-surgery', userCtrl.viewExistingSurgery)
router.post('/share', userCtrl.share)


module.exports = router