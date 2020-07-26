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

//@decs Show Public Blog Posts
//@route GET /blogs
router.get('/', ensureAuth, async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        res.render('blogs/index', {
            blogs,
        })
    } catch (err) {
        console.err(err)
        res.render('error/500')
    }
})


//@decs Show Single Blog Page
//@route GET /blogs/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('user')
            .lean()
        if(!blog) {
            return res.render('error/404')
        }

        res.render('blogs/show', {
            blog,
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



//@decs Show Edit Page
//@route GET /edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id
        }).lean()
    
        if (!blog) {
            return res.render('error/404')
        }
    
        if (blog.user != req.user.id) {
            res.redirect('/blogs')
        } else {
            res.render('blogs/edit', {
                blog,
            })
        }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
   
})


//@decs Update Blog Post
//@route PUT /blogs/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).lean()

    if (!blog) {
        return res.render('error/404')
    }

    if (blog.user != req.user.id) {
        res.redirect('/blogs')
    } else {
        const blog = await Blog.findOneAndUpdate({ _id: req.params.id}, req.body, {
            new: true,
            runValidators: true,
        })
        res.redirect('/dashboard')
    }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
   

})


//@decs Delete Blog Post
//@route DELETE /blogs/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Blog.remove({ _id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


//@decs Show From User
//@route GET /blogs/user/userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const blogs = await Blog.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('blogs/index', {
            blogs,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})






module.exports = router