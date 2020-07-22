const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Blog = require('../models/Blog')


//@decs Show Add Blog Page
//@route GET /add
router.get('/add', ensureAuth, (req, res) => {
    res.render('blogs/add')
})

//@decs Process Add Blog Post
//@route POST /
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Blog.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})



module.exports = router