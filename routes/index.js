const express = require('express')

const router = express.Router()


//@decs Login Page
//@route GET /
router.get('/',(req, res) => {
    res.render('signin', {
        layout: 'login'
    })
})


//@decs Dashboard Page
//@route  /dashboaard
router.get('/dashboard',(req, res) => {
    res.render('dashboard')
})


module.exports = router