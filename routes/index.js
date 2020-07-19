const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')

const Blog = require('../models/Blog')


//@decs Login Page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('signin', {
        layout: 'login'
    })
})


//@decs Dashboard Page
//@route  /dashboaard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const blogs = await Blog.find( { user: req.user.id}).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            blogs
        })
    } catch (err) {
        console.err(err)
        res.render(error/500)
    }

   
})


module.exports = router