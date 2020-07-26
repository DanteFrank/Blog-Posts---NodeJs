const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const morgan = require('morgan')
const connectDB = require('./config/db')

//Load Config 
dotenv.config({path: './config/config.env'})

//Passport Config
require('./config/passport')(passport)

//Conect DB
connectDB()

const app = express()


//Body Parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


//Method- Override For Put Request
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))


//Morgan Login
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebar Helpers
const { formatDate, stripTags, truncate, editIcon} = require('./helpers/hbs')

//Handlesbars
app.engine('.hbs', exphbs({ 
    helpers: { formatDate, stripTags, truncate, editIcon},
     defaultLayout: 'main', 
     extname: '.hbs'
    }));
app.set('view engine', '.hbs');


//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))


//Passport Middleware 
app.use(passport.initialize())
app.use(passport.session())

//Set Global user var
app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})



//Static Folders
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/blogs', require('./routes/blogs'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`,  this.address().port, app.config.env))

