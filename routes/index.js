const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')


//@decs Login Page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('signin', {
        layout: 'login'
    })
})


//@decs Dashboard Page
//@route  /dashboaard
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.firstName,
    })
})


module.exports = router