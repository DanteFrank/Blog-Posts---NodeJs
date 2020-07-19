const express = require('express')
const passport = require('passport')
const router = express.Router()


//@decs Auth with Google 
//@route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


//@decs Google Callback
//@route  /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

//@decs Logout
//@route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})



module.exports = router